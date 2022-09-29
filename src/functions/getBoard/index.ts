import { formatJSONResponse } from '@libs/APIResponses';
import Dynamo from '@libs/Dynamo';
import { BoardRecord, IdeaRecord, VoteRecord } from 'src/types/dynamo';
import { APIGatewayProxyEvent } from 'aws-lambda';

export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    const tableName = process.env.singleTable;

    const boardId = event.pathParameters!.boardId;

    //get the boards
    const board = await Dynamo.get<BoardRecord>({
      tableName,
      pkValue: boardId,
    });

    if (!board.id) {
      return formatJSONResponse({
        statusCode: 404,
        body: { message: 'Board not found' },
      });
    }

    const { pk, sk, ...responseData } = board;

    //get the ideas
    const ideas = await Dynamo.query<IdeaRecord>({
      tableName,
      index: 'index1',
      pkValue: `idea-${boardId}`,
      pkKey: 'pk',
    });
    const ideaDataPromiseArray = ideas.map(async ({ pk, sk, boardId, ...ideaData }) => {
      const votes = await Dynamo.query<VoteRecord>({
        tableName,
        index: 'index1',
        pkValue: `vote-${ideaData.id}`,
        pkKey: 'pk',
      });
      return {
        ...ideaData,
        votes: votes.length,
      };
    });

    const ideaDataArray = await (
      await Promise.all(ideaDataPromiseArray)
    ).sort((a, b) => b.votes - a.votes);

    return formatJSONResponse({
      body: {
        ...responseData,
        ideas: ideaDataArray,
      },
    });
  } catch (error) {
    return formatJSONResponse({ statusCode: 500, body: error.message });
  }
};
