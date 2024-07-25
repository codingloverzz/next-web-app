export type VersionType = {
  id: number;
  versionname: string;
  userid: number;
  comment: string;
};
export type FlowType = {
  id: string;
  version_id: number;
  userid: number;
  data: string;
};
