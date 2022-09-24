import { formatJSONResponse } from '@libs/APIResponses';
import Dynamo from '@libs/Dynamo';
import { BoardRecord } from 'src/types/dynamo';

export const handler = async () => {
  try {
    const tableName = process.env.singleTable;

    //get the boards
    const boards = await Dynamo.query<BoardRecord>({
      tableName,
      index: 'index1',
      pkKey: 'pk',
      pkValue: 'board',
      limit: 10,
    });

    const responseData = boards
      .map(({ pk, sk, ...rest }) => rest)
      .filter((board) => board.isPublic); //only show public boards

    return formatJSONResponse({ body: responseData });
  } catch (error) {
    return formatJSONResponse({ statusCode: 500, body: error.message });
  }
};
