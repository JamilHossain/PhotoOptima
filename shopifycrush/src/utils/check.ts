import { Prisma, PrismaClient } from "../generated/client";
import all_plans_json from "../plans.json";

export type checkReturnType = {
  msg: string;
  code: number;
};

export const check = async (
  size: number,
  access_token: string,
  shop: string,
  prisma: PrismaClient
): Promise<checkReturnType | undefined> => {
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
    console.log(err);
    return {
      msg: "error while getting plan id -> check.ts",
      code: 1,
    };
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
    return {
      msg: "shopify didn't find payment receipt -> check.ts",
      code: 2,
    };
  } else {
    if (plan.recurring_application_charge.status !== "active") {
      return {
        msg: "tagged plan not active -> check.ts",
        code: 3,
      };
    } else {
      const plan_name: keyof typeof all_plans_json =
        plan.recurring_application_charge.name;
      const plan_mega_bytes = all_plans_json[plan_name];
      const plan_bytes =
        BigInt(parseInt(plan_mega_bytes)) * BigInt(1024) * BigInt(1024);
      const MAX_RETRIES = 20;
      let retries = 0;
      while (retries < MAX_RETRIES) {
        try {
          const ret = await prisma.$transaction(
            async (tx) => {
              const billRow = await tx.billTable.findFirst({
                where: {
                  shop_id: shop,
                  billing_on: plan.recurring_application_charge.billing_on,
                  charge_id: plan.recurring_application_charge.id,
                },
              });
              if (billRow) {
                const new_total =
                  BigInt(billRow.total_compressed) + BigInt(size);
                if (new_total > plan_bytes) {
                  throw new Error("limit-cross");
                }
                await tx.billTable.updateMany({
                  where: {
                    shop_id: shop,
                    billing_on: plan.recurring_application_charge.billing_on,
                    charge_id: plan.recurring_application_charge.id,
                  },
                  data: {
                    total_compressed: new_total.toString(),
                  },
                });
              } else {
                await tx.billTable.create({
                  data: {
                    shop_id: shop,
                    billing_on: plan.recurring_application_charge.billing_on,
                    charge_id: plan.recurring_application_charge.id,
                    total_compressed: BigInt(size).toString(),
                  },
                });
              }
              return "ok";
            },
            {
              // optional, default defined by database configuration
              isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
            }
          );
          return {
            msg: ret,
            code: 7,
          };
        } catch (err: any) {
          if (err.code === "P2034") {
            retries++;
            continue;
          }
          if (err.message === "limit-cross") {
            return {
              msg: "limit-cross",
              code: 6,
            };
          }
          console.log(err);
          return {
            msg: "error in db transaction, check.ts",
            code: 4,
          };
        }
      }
      return {
        msg: "max retries over, check.ts",
        code: 5,
      };
    }
  }
};
