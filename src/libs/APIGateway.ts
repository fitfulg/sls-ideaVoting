import { APIGatewayProxyEvent } from 'aws-lambda';

export const getUserId = (event: APIGatewayProxyEvent) => {
  // Congnito's authorizer
  return event.requestContext?.authorizer?.claims?.sub || 'unknown';
};
