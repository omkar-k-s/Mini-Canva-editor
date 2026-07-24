import app from '../src/index'
import { connectDatabase } from '../src/config/database'

// Connect on first invocation (connection is reused across warm invocations)
connectDatabase()

export default app
