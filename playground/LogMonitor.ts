import LogMonitor, {IApprovalListener, Approval} from '../src/LogMonitor'

class Listener implements IApprovalListener {
  onApproval(approval: Approval) {
    console.log(approval)
  }
}

(async () => {
  const logMonitor = new LogMonitor()
  const listener = new Listener()

  logMonitor.add(listener)
  logMonitor.start()
})()
