process.env.NODE_ENV = "production";
import "dotenv/config";
import("node-fetch");
import express, { Request, Response } from "express";
import { PrismaClient } from "./generated/client";
import Randomstring from "randomstring";
import cookieParser from "cookie-parser";
import crypto from "crypto";
import cryptr from "cryptr";
import querystring from "querystring";
import path from "path";
import sharp from "sharp";
import expressStaticGzip from "express-static-gzip";
import { simple, pro } from "./plans.json";

const prisma = new PrismaClient();
const cryptr_func = new cryptr(process.env.COOKIE_SECRET!);

const app = express();

const port = process.env.PORT;
const scopes = "write_products";
const forwardingAddress = process.env.HOST;
const apiKey = process.env.SHOPIFY_API_KEY;
const apiSecret = process.env.SHOPIFY_API_SECRET;

app.use(cookieParser(process.env.COOKIE_SECRET));

//
//app.use(express.static(path.join(__dirname, "..", "..", "front", "dist")));
app.use(
  "/",
  expressStaticGzip(path.join(__dirname, "..", "..", "front", "dist"), {
    // serveStatic: { maxAge: 24 * 3600 * 1000 },
  })
);
//
//
//
//

app.get("/marchantcookie", async (req: Request, res: Response) => {
  const { access_token, shop } = JSON.parse(
    cryptr_func.decrypt(req.signedCookies.shopifymarchantshopcookie)
  );
  res.json({
    access_token,
    shop,
  });
});

app.get("/helloworld", async (req: Request, res: Response) => {
  res.json({ respone: "ok" });
});

app.get("/shopify", (req: Request, res: Response) => {
  const shopName = req.query.shop;
  if (shopName) {
    const shopState = Randomstring.generate(20);
    const redirectURL = forwardingAddress + "/callback";

    // install url for app install
    const installUrl =
      "https://" +
      shopName +
      "/admin/oauth/authorize?client_id=" +
      apiKey +
      "&scope=" +
      scopes +
      "&state=" +
      shopState +
      "&redirect_uri=" +
      redirectURL;

    res.cookie("shopifyinitstate", cryptr_func.encrypt(shopState), {
      httpOnly: true,
      signed: true,
    });
    res.redirect(installUrl);
  } else {
    return res.status(400).send('Missing "Shop Name" parameter!!');
  }
});

//
//
//

app.get("/callback", (req: any, res: Response) => {
  const { shop, hmac, code, state } = req.query;
  const stateCookie = cryptr_func.decrypt(req.signedCookies.shopifyinitstate);

  if (state !== stateCookie) {
    return res.status(400).send("request origin cannot be found");
  }

  if (shop && hmac && code) {
    const myMap = Object.assign({}, req.query);
    delete myMap["hmac"];
    delete myMap["signature"];

    const message = querystring.stringify(myMap);
    const providedHmac = Buffer.from(hmac, "utf-8");
    const generatedHash = Buffer.from(
      crypto.createHmac("sha256", apiSecret!).update(message).digest("hex"),
      "utf-8"
    );
    let hashEquals = false;
    try {
      hashEquals = crypto.timingSafeEqual(generatedHash, providedHmac);
    } catch (e) {
      hashEquals = false;
    }
    if (!hashEquals) {
      return res.status(400).send("HMAC validation failed");
    }
    const accessTokenRequestUrl =
      "https://" + shop + "/admin/oauth/access_token";
    const accessTokenPayload = {
      client_id: apiKey,
      client_secret: apiSecret,
      code,
    };

    fetch(accessTokenRequestUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(accessTokenPayload),
    })
      .then((response: any) => response.json())
      .then(async (data: any) => {
        const alreadyInstalled: boolean = !!(await prisma.shopTable.findFirst({
          where: { shop_id: shop },
        }));
        if (!alreadyInstalled) {
          await prisma.shopTable.create({
            data: {
              shop_id: shop,
              token: data.access_token.toString(),
              app_plan: "N/A",
              receipt_anchor: "N/A",
              total_compressed: "0",
              total_saved: "0",
              total_stored: "0",
            },
          });
        }
        res.cookie(
          "shopifymarchantshopcookie",
          cryptr_func.encrypt(
            JSON.stringify({
              access_token: data.access_token,
              shop,
            })
          ),
          {
            httpOnly: true,
            signed: true,
          }
        );
        res.redirect(`${process.env.HOST!}`);
      })
      .catch((err: any) => {
        res.send(err.toString());
      });
  } else {
    return res.status(400).send("required parameter missing");
  }
});

//
//
//

app.get("/allproducts", async (req: Request, res: Response) => {
  const { access_token, shop } = JSON.parse(
    cryptr_func.decrypt(req.signedCookies.shopifymarchantshopcookie)
  );

  let serverFlags: any = [];
  try {
    serverFlags = await prisma.crushedTable.findMany({
      where: {
        shop_id: shop,
      },
    });
  } catch (e) {
    console.log(e);
  }

  const myURL = `https://${shop}/admin/api/2023-07/products.json`;
  fetch(myURL, {
    method: "GET",
    headers: {
      "X-Shopify-Access-Token": access_token,
    },
  })
    .then((response: any) => response.json())
    .then((data: any) => {
      data.serverFlags = serverFlags;
      res.status(200).json(data);
    })
    .catch((err: any) => {
      res.status(400).send(err.toString());
      console.log(err);
    });
});

//
//
//

app.get("/createimage", (req: Request, res: Response) => {
  let pic = {
    image: {
      position: 1,
      attachment:
        "iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAhFBMVEX4+Pj///rf1H1az9cZoe1UWAAAAAElFTkSuQmCC",
      filename: "created_by_sumon",
    },
  };

  const { access_token, shop } = JSON.parse(
    cryptr_func.decrypt(req.signedCookies.shopifymarchantshopcookie)
  );
  const myURL = `https://${shop}/admin/api/2023-07/products/8606524145955/images.json`;
  fetch(myURL, {
    method: "POST",
    headers: {
      "X-Shopify-Access-Token": access_token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pic),
  })
    .then((response: any) => response.json())
    .then((data: any) => {
      res.json(data);
    })
    .catch((err: any) => {
      res.send(err.toString());
    });
});

//
//
//

app.get("/updateimage", (req: Request, res: Response) => {
  let pic = {
    image: {
      position: 1,
      attachment:
        "iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAYAAAA+s9J6AAAAAXNSR0IArs4c6QAAIABJREFUeF7tnWeoH8XXx/q2AAAAAElFTkSuQmCC",
      filename: "created_by_sumon.png",
    },
  };

  const { access_token, shop } = JSON.parse(
    cryptr_func.decrypt(req.signedCookies.shopifymarchantshopcookie)
  );
  const myURL = `https://${shop}/admin/api/2023-07/products/8606524145955/images/42452612022563.json`;
  fetch(myURL, {
    method: "PUT",
    headers: {
      "X-Shopify-Access-Token": access_token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pic),
  })
    .then((response: any) => response.json())
    .then((data: any) => {
      res.json(data);
    })
    .catch((err: any) => {
      res.send(err.toString());
    });
});

//
//
//

app.use(express.json());

app.post("/docomp", async (req: Request, res: Response) => {
  const { product_id, img_id, cdn_url, quality } = req.body;
  //quality coming test
  // console.log(quality);
  //

  const { access_token, shop } = JSON.parse(
    cryptr_func.decrypt(req.signedCookies.shopifymarchantshopcookie)
  );

  // const payments_res = await fetch(
  //   `https://${shop}/admin/api/2023-07/recurring_application_charges.json`,
  //   {
  //     method: "GET",
  //     headers: {
  //       "X-Shopify-Access-Token": access_token,
  //     },
  //   }
  // );
  // const payments = await payments_res.json();
  // const active_plan = ((charges: any) => {
  //   for (let i = 0; i < charges.length; i++) {
  //     if (charges[i].status === "active") return charges[i];
  //   }
  //   return null;
  // })(payments.recurring_application_charges);

  // const monthly_data_limit = 0;

  let response = await fetch(cdn_url);
  const ourblob = await response.blob();
  const ourArrayBuffer = await ourblob.arrayBuffer();
  const ourBuffer = Buffer.from(ourArrayBuffer);
  const original_size = ourBuffer.length;
  const img_compressed = await sharp(ourBuffer).webp({ quality }).toBuffer();
  const compressed_size = img_compressed.length;
  const size_saved = original_size - compressed_size;
  const our_string = img_compressed.toString("base64");

  const pic = {
    image: {
      attachment: our_string,
    },
  };

  const myURL = `https://${shop}/admin/api/2023-07/products/${product_id}/images/${img_id}.json`;
  fetch(myURL, {
    method: "PUT",
    headers: {
      "X-Shopify-Access-Token": access_token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pic),
  })
    .then((response: any) => response.json())
    .then(async (data: any) => {
      try {
        await prisma.crushedTable.create({
          data: {
            shop_id: shop,
            img_id: img_id.toString(),
            product_id: product_id.toString(),
            created_at: data.image.created_at,
            anchor_url: "N/A",
            size: original_size.toString(),
            size_saved: size_saved.toString(),
          },
        });
      } catch (e) {
        console.log(e);
      }
      res.status(200).json(data);
    })
    .catch((err: any) => {
      res.status(400).send(err.toString());
    });
});

//

app.get("/cancelplan", async (req: Request, res: Response) => {
  const { access_token, shop } = JSON.parse(
    cryptr_func.decrypt(req.signedCookies.shopifymarchantshopcookie)
  );

  const payments_res = await fetch(
    `https://${shop}/admin/api/2023-07/recurring_application_charges.json`,
    {
      method: "GET",
      headers: {
        "X-Shopify-Access-Token": access_token,
      },
    }
  );
  const payments = await payments_res.json();
  const active_plan: any = ((charges: any) => {
    for (let i = 0; i < charges.length; i++) {
      if (charges[i].status === "active") return charges[i];
    }
    return null;
  })(payments.recurring_application_charges);
  if (active_plan) {
    const cancel_res = await fetch(
      `https://${shop}/admin/api/2023-07/recurring_application_charges/${active_plan.id}.json`,
      {
        method: "DELETE",
        headers: {
          "X-Shopify-Access-Token": access_token,
        },
      }
    );

    if (cancel_res.status == 200) {
      try {
        await prisma.shopTable.updateMany({
          where: {
            shop_id: shop,
          },
          data: {
            receipt_anchor: "z",
          },
        });
      } catch (err) {
        console.log("couldn't delete receipt anchor -> cancelplan");
        console.log(err);
        return;
      }
      //
      res.json({ msg: `${active_plan.name} plan cancelled`, msg_code: "2" });
    } else {
      res.json({ msg: "something wrong happened", msg_code: "3" });
    }
  } else {
    res.json({ msg: "you dont have any plan", msg_code: "1" });
  }
});

app.get("/currentplan", async (req: Request, res: Response) => {
  const { access_token, shop } = JSON.parse(
    cryptr_func.decrypt(req.signedCookies.shopifymarchantshopcookie)
  );

  const payments_res = await fetch(
    `https://${shop}/admin/api/2023-07/recurring_application_charges.json`,
    {
      method: "GET",
      headers: {
        "X-Shopify-Access-Token": access_token,
      },
    }
  );
  const payments = await payments_res.json();
  //console.log(payments);

  const active_plan: any = ((charges: any) => {
    for (let i = 0; i < charges.length; i++) {
      if (charges[i].status === "active") return charges[i];
    }
    return null;
  })(payments.recurring_application_charges);

  if (active_plan) {
    try {
      await prisma.shopTable.updateMany({
        where: {
          shop_id: shop,
        },
        data: {
          receipt_anchor: active_plan.id.toString(),
        },
      });
    } catch (err) {
      res.json({
        msg: "some error happened while adding plan tag, active plan available",
      });
      console.log(err);
      return;
    }
    res.json({
      name: active_plan.name,
      price: active_plan.price,
    });
  } else {
    res.json({
      name: "No plan",
      price: "0",
    });
  }
});

app.get("/simple", async (req: Request, res: Response) => {
  const { access_token, shop } = JSON.parse(
    cryptr_func.decrypt(req.signedCookies.shopifymarchantshopcookie)
  );
  const new_plan_res = await fetch(
    `https://${shop}/admin/api/2023-07/recurring_application_charges.json`,
    {
      method: "POST",
      headers: {
        "X-Shopify-Access-Token": access_token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recurring_application_charge: {
          name: "Simple",
          price: 5.0,
          return_url: `${process.env.HOST}/saveplantag`,
          test: true,
        },
      }),
    }
  );
  const new_plan = await new_plan_res.json();
  res.redirect(new_plan.recurring_application_charge.confirmation_url);
});

app.get("/pro", async (req: Request, res: Response) => {
  const { access_token, shop } = JSON.parse(
    cryptr_func.decrypt(req.signedCookies.shopifymarchantshopcookie)
  );
  const new_plan_res = await fetch(
    `https://${shop}/admin/api/2023-07/recurring_application_charges.json`,
    {
      method: "POST",
      headers: {
        "X-Shopify-Access-Token": access_token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recurring_application_charge: {
          name: "Pro",
          price: 10.0,
          return_url: `${process.env.HOST}/saveplantag`,
          test: true,
        },
      }),
    }
  );
  const new_plan = await new_plan_res.json();
  res.redirect(new_plan.recurring_application_charge.confirmation_url);
});

app.get("/saveplantag", async (req: any, res: Response) => {
  const { charge_id } = req.query;
  const { access_token, shop } = JSON.parse(
    cryptr_func.decrypt(req.signedCookies.shopifymarchantshopcookie)
  );
  try {
    await prisma.shopTable.updateMany({
      where: {
        shop_id: shop,
      },
      data: {
        receipt_anchor: charge_id.toString(),
      },
    });
  } catch (err) {
    res.json({
      msg: "some error happened while adding plan tag. -> saveplantag",
    });
    console.log(err);
    return;
  }
  res.redirect(`${process.env.HOST!}`);
});

app.get("/currentplanv2", async (req: Request, res: Response) => {
  const { access_token, shop } = JSON.parse(
    cryptr_func.decrypt(req.signedCookies.shopifymarchantshopcookie)
  );
  let shopRow: any;
  try {
    shopRow = await prisma.shopTable.findFirst({
      where: {
        shop_id: shop,
      },
      select: {
        receipt_anchor: true,
      },
    });
  } catch (err) {
    res.json({
      msg: "error while getting plan id -> currentplanv2",
      custom_error: 1,
    });
    console.log(err);
    return;
  }
  const plan_id = shopRow.receipt_anchor;
  const plan_res = await fetch(
    `https://${shop}/admin/api/2023-07/recurring_application_charges/${plan_id}.json`,
    {
      method: "GET",
      headers: {
        "X-Shopify-Access-Token": access_token,
      },
    }
  );
  const plan = await plan_res.json();
  if (plan.errors !== undefined) {
    res.json({
      msg: "shopify didn't find payment receipt -> currentplanv2",
      custom_error: 2,
    });
  } else {
    if (plan.recurring_application_charge.status !== "active") {
      res.json({
        msg: "tagged plan not active -> currentplanv2",
        custom_error: 3,
      });
    } else {
      res.json(plan);
    }
  }
});

//
//
app.get("/createtesthook", async (req: Request, res: Response) => {
  const { access_token, shop } = JSON.parse(
    cryptr_func.decrypt(req.signedCookies.shopifymarchantshopcookie)
  );
  const test_hook_res = await fetch(
    `https://${shop}//admin/api/2023-07/webhooks.json`,
    {
      method: "POST",
      headers: {
        "X-Shopify-Access-Token": access_token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        webhook: {
          address: `${process.env.HOST}/loghookpayload`,
          topic: "app_subscriptions/update",
          format: "json",
          fields: ["status"],
        },
      }),
    }
  );
  const test_hook = await test_hook_res.json();
  console.log(test_hook);
  res.send("ok");
});

app.get("/deletetesthook", async (req: Request, res: Response) => {
  const { access_token, shop } = JSON.parse(
    cryptr_func.decrypt(req.signedCookies.shopifymarchantshopcookie)
  );
  const { id } = req.query;
  const test_hook_res = await fetch(
    `https://${shop}//admin/api/2023-07/webhooks/${id}.json`,
    {
      method: "DELETE",
      headers: {
        "X-Shopify-Access-Token": access_token,
      },
    }
  );
  const test_hook = await test_hook_res.json();
  console.log(test_hook_res.status);
  console.log(test_hook);
  res.send("ok");
});

app.get("/printhooks", async (req: Request, res: Response) => {
  const { access_token, shop } = JSON.parse(
    cryptr_func.decrypt(req.signedCookies.shopifymarchantshopcookie)
  );
  const test_hook_res = await fetch(
    `https://${shop}//admin/api/2023-07/webhooks.json`,
    {
      method: "GET",
      headers: {
        "X-Shopify-Access-Token": access_token,
      },
    }
  );
  const test_hooks = await test_hook_res.json();
  console.log(test_hooks);
  try {
    console.log(test_hooks.webhooks[0].fields);
  } catch (err) {
    console.log("custom ... no hooks");
  }
  res.send("ok");
});

app.post("/loghookpayload", async (req: Request, res: Response) => {
  console.log(req.body);
  console.log(req.headers);
  res.status(200).end();
});

app.listen(port, () => {
  console.log(`listening on ${port}`);
});
