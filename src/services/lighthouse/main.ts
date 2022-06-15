import {
  DescribeInstancesTrafficPackagesRequest,
  DescribeInstancesTrafficPackagesResponse,
} from 'https://raw.githubusercontent.com/TencentCloud/tencentcloud-sdk-nodejs/master/src/services/lighthouse/v20200324/lighthouse_models.ts';
import { ApiParams, invoke } from '../../common/sign.ts';

/**
 * 查看实例流量包详情
 * https://cloud.tencent.com/document/product/1207/48681
 */
export async function invokeDescribeInstancesTrafficPackages(
  p: DescribeInstancesTrafficPackagesRequest,
  region = 'ap-hongkong',
): Promise<DescribeInstancesTrafficPackagesResponse> {
  const apiParams: ApiParams = {
    Action: 'DescribeInstancesTrafficPackages',
    Version: '2020-03-24',
    Region: region,
    ...p,
  };
  const res = await invoke(apiParams);
  return res;
}
