export function convertDocToObj(doc: any) {
  doc._id = doc._id.toString();
  return doc;
}

export const formatNumber = (x: number) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const formatId = (x: string) => {
  return `...${x.substring(20, 24)}`;
};
export const formatDes = (x: string) => {
  return `${x.substring(0, 40)}....`;
};
