export const errorHelper = function (e) {
  try {
    let {code, error: {details}} = JSON.parse(e)
    let message = details && details.map(item => {
      return item.message
    })
    let tips = `code: ${code} | ${message} `
    console.log(e)
    return tips
  } catch (err) {
    console.log(err)
    return e
  }
}
