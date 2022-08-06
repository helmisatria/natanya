import Cookies from 'cookies'
import jwt from 'jsonwebtoken'
import { pick } from 'lodash'
import { NextApiRequest, NextApiResponse } from 'next'

export default function getMe(req: NextApiRequest, res: NextApiResponse) {
  const cookies = new Cookies(req, res)

  const authorization = cookies.get('Authorization')

  if (!authorization) {
    return res.status(401).send(null)
  }

  return jwt.verify(authorization, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err) {
      return res.status(401).send(null)
    }

    return res.status(200).send(pick(decoded, ['name']))
  })
}
