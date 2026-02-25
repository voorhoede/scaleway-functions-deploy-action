import deployFunction from '../../../src/function';
import { INSTANCE_NAME } from '../../../src/constants';

await deployFunction({ namespaceName: INSTANCE_NAME });