import { getProtocol } from '../../../protocols/get.js'
import { getRpc } from '../../../rpc/get.js'

// Build message of events `request` as:
//  STATUS [ERROR] - PROTOCOL METHOD RPC /PATH COMMAND...
export const getRequestMessage = function ({
  protocol,
  rpc,
  method,
  path,
  commandpath = '',
  summary,
  error: { status = 'SUCCESS', description = '' } = {},
}) {
  const suffixText = getSuffixText({
    status,
    summary,
    commandpath,
    description,
  })

  const { title: protocolTitle } = getProtocol(protocol)
  const rpcTitle = getRpcTitle({ rpc })

  const message = [
    status,
    '-',
    protocolTitle,
    method,
    rpcTitle,
    path,
    suffixText,
  ]
    .filter(Boolean)
    .join(' ')
  return message
}

const getRpcTitle = function ({ rpc }) {
  if (rpc === undefined) {
    return
  }

  const { title: rpcTitle } = getRpc(rpc)
  return rpcTitle
}

const getSuffixText = function ({ status, summary, commandpath, description }) {
  if (status === 'SUCCESS') {
    return summary
  }

  if (!description) {
    return commandpath
  }

  return `${commandpath} - ${description}`
}
