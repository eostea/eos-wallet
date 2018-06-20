export const errorHelper = function (e) {
  try {
    let {error: {details, what, code}} = JSON.parse(e)
    let message = ''
    if (details && details.length > 0) {
      message = details.length > 0 && details.map(item => {
        return item.message
      })
    } else {
      message = what
    }
    let tips = `code: ${code} | ${message} `
    console.log(e)
    return tips
  } catch (err) {
    console.log(err)
    return e
  }
}
