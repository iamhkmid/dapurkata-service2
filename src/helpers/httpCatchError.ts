import { Response } from "express"

export const httpCatchError = ({ error, res }: { error: any, res: Response }) => {
  if (error?.name === "ValidationError") {
    res.status(400).send({
      statusCode: "400",
      message: error?.message
    })
  } else {
    try {
      const errorObj = JSON.parse(error?.message)
      res.status(500).send({
        statusCode: errorObj?.statusCode,
        message: errorObj?.message
      })
    } catch {
      res.status(500).send({
        statusCode: "500",
        message: "Something went wrong"
      })
    }
  }
}