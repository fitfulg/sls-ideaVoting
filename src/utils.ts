import { formatJSONResponse } from '@libs/APIResponses';

export const validateBody = (body: Record<string, any>) => {
  if (!body.name) {
    return formatJSONResponse({
      body: { message: 'name is required' },
      statusCode: 400,
    });
  }
  return;
};
