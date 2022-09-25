export type CreateBoardBody = {
  name: string;
  description?: string;
  isPublic?: boolean;
};

export type CreateIdeaBody = {
  title: string;
  description?: string;
  boardId: string;
};
