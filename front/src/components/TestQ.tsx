function TestQ({ ourRef }: { ourRef: { current: number } }) {
  console.log("TestQ rendered");
  return (
    <div>
      <button onClick={() => console.log(ourRef)}>click me</button>
    </div>
  );
}

export default TestQ;
