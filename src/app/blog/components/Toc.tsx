export default function Toc({ data }: { data: any[] }) {
  return (
    <div>
      {data.map((item) => {
        return <div className="pl-2">{item.title}</div>;
      })}
    </div>
  );
}
