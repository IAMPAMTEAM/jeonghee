import { response } from "../util/response.js";

const PORTONE_V2_API_SECRET = process.env.PORTONE_V2_API_SECRET;

//payments.json
// {
//   "paymentId": " `payment-${crypto.randomUUID()}`",
//   "socialUser": "sss@sss.sss",
//   'orderProduct': 'cloudOps',
//   'currency': 'CURRENCY_KRW',
//   'payMethod': 'CARD',
//   'amount': 1000,
//   'paidAt': '2021-09-01 00:00:00 KST',
// }

// productPrice.json
// {
//   'cloudOps': 100,
//   'zerotrust': 120,
// }

export const handler = async (event) => {
  const origin = event.headers.origin;
  const productsPrice = { cloudOps: 100, zerotrust: 120 };

  try {
    console.log("event", event);
    const { paymentId, orderProduct } = JSON.parse(event.body);

    // 1. 포트원 결제내역 단건조회 API 호출
    const paymentResponse = await fetch(
      `https://api.portone.io/payments/${paymentId}`,
      { headers: { Authorization: `PortOne ${PORTONE_V2_API_SECRET}` } }
    );
    if (!paymentResponse.ok)
      throw new Error(`paymentResponse: ${await paymentResponse.json()}`);

    const payment = await paymentResponse.json();
    console.log("payment", payment);

    // 2. 고객사 내부 주문 데이터의 가격과 실제 지불된 금액을 비교합니다.
    const productPrice = productsPrice[orderProduct];
    if (productPrice === payment.amount.total) {
      switch (payment.status) {
        case "VIRTUAL_ACCOUNT_ISSUED": {
          console.log("가상 계좌가 발급된 상태입니다.");
          return await response(
            200,
            { message: "가상 계좌가 발급되었습니다.", paymentDetails: payment },
            origin
          );
        }
        case "PAID": {
          console.log("올바른 금액의 지불이 완료되었습니다!");
          return await response(
            200,
            {
              message: "올바른 금액의 지불이 완료되었습니다!",
              paymentDetails: payment,
            },
            origin
          );
        }
      }
    } else {
      console.log("결제 금액이 불일치하여 위/변조 시도가 의심됩니다.");
      return await response(
        403,
        {
          message: "결제 금액이 불일치하여 위/변조 시도가 의심됩니다.",
          paymentDetails: payment,
        },
        origin
      );
    }
  } catch (error) {
    response(400, { error: error.message }, origin);
  }
};
