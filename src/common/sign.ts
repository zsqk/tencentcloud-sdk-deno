// tencent cloud tools

// 签名方法有两种 v1, v3, 目前同时有效, 选一种即可.
// 签名是放在请求头中的.

// API 文档中给的例子是 GET 方法调用,
// 实际上如果使用 v3 签名方法, 则必须为 POST 方法调用.

// 公共参数: https://cloud.tencent.com/document/api/1207/47564
// 签名方法: https://cloud.tencent.com/document/api/1207/47565

import {
  hashString,
  hexString,
  hmac,
} from 'https://deno.land/x/somefn@v0.6.0/js/hash.ts';
import { secretID, secretKey } from '../constant/env.ts';

const domain = 'lighthouse.tencentcloudapi.com';
const service = 'lighthouse';

const contentType = 'application/json; charset=utf-8';

export type ApiParams = {
  Action: string;
  Region: string;
  Version: string;
  [k: string]: unknown;
};

export async function invoke(apiParams: ApiParams) {
  const url = new URL(`https://${domain}/`);
  const { Action: _Action, Region: _Region, Version: _Version, ...rest } =
    apiParams;
  const body = JSON.stringify(rest);
  const v3 = await genAuthHeaders(apiParams, body);
  const res = await fetch(url.toString(), {
    method: 'POST',
    headers: [
      ...v3,
      ['Host', domain],
      ['Content-Type', contentType],
    ],
    body: JSON.stringify(rest),
  });
  const resBody = await res.json();
  return resBody.Response;
}

async function genAuthHeaders(apiParams: ApiParams, body: string) {
  const { Action, Region, Version } = apiParams;

  const now = new Date();
  const timestamp = Math.trunc(now.getTime() / 1000).toString();

  const signedHeaders = 'content-type;host';

  const canonicalRequest = ''.concat(
    'POST' + '\n', // HTTPRequestMethod
    '/' + '\n', // CanonicalURI
    '' + '\n', //CanonicalQueryString
    `content-type:${contentType}\nhost:${domain}\n` + '\n', // CanonicalHeaders
    signedHeaders + '\n', // SignedHeaders
    await hashString('SHA-256', body), // HashedRequestPayload
  );

  console.log('canonicalRequest', canonicalRequest);

  const date = genDateString(now);
  const credentialScope = `${date}/${service}/tc3_request`;
  const hashedCanonicalRequest = await hashString('SHA-256', canonicalRequest);
  const stringToSign = ''.concat(
    'TC3-HMAC-SHA256' + '\n',
    timestamp + '\n',
    credentialScope + '\n',
    hashedCanonicalRequest,
  );

  const s1 = await hmac('SHA-256', `TC3${secretKey}`, date);
  const s2 = await hmac('SHA-256', s1, service);
  const s3 = await hmac('SHA-256', s2, 'tc3_request');
  const sign = await hmac('SHA-256', s3, stringToSign);

  const auth = ''.concat(
    `TC3-HMAC-SHA256 `,
    `Credential=${secretID}/${credentialScope}, `,
    `SignedHeaders=${signedHeaders}, `,
    `Signature=${hexString(sign)}`,
  );

  console.log('auth', auth);

  const authParams: [string, string][] = [
    ['X-TC-Action', Action],
    ['X-TC-Region', Region],
    ['X-TC-Timestamp', timestamp],
    ['X-TC-Version', Version],
    ['Authorization', auth],
  ];
  return authParams;
}

function genDateString(date: Date) {
  const y = date.getUTCFullYear();
  const m = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const d = date.getUTCDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
}
