import DashboardSkeleton from "../../ui/skeletons";

//通过loading.tsx，next会把dashboard这个页面组件当作一个单独的chunk
//把loading.tsx放到 （overview）文件夹中，则这个overview只会对dashboard这个路径起作用
export default function Loading() {
  return <DashboardSkeleton />;
}
