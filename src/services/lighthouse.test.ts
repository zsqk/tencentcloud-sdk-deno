import { byteRender } from '../render.ts';
import { invokeDescribeInstancesTrafficPackages } from './lighthouse.ts';

// TODO
Deno.test('test-invokeDescribeInstancesTrafficPackages', async () => {
  const res = await invokeDescribeInstancesTrafficPackages({});
  console.log(res);
  console.log(res.InstanceTrafficPackageSet[0]);
  const b = res.InstanceTrafficPackageSet[0].TrafficPackageSet[0]
    .TrafficPackageRemaining;

  console.log(`剩余 ${byteRender(b)} 流量`);
});
