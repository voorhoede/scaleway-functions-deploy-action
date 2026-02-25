import deployObjects from '../../../src/storage';
import { INSTANCE_NAME } from '../../../src/constants';

await deployObjects({ bucketName: INSTANCE_NAME });