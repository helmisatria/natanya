import Cookies from 'cookies'
import { IncomingMessage, ServerResponse } from 'http'
import jwt from 'jsonwebtoken'
import { pick } from 'lodash'

export const getUser = (req: IncomingMessage, res: ServerResponse) => {
  const cookies = new Cookies(req, res)

  const authorization = cookies.get('Authorization')

  if (!authorization) {
    return null
  }

  return jwt.verify(authorization, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err) {
      return null
    }

    return pick(decoded, ['name'])
  })
}
