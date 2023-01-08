/* eslint-disabled */

// import styled from "styled-components";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// let YellowButton = styled.button`
//     background: ${props => props.bg};
//     color: ${props => props.bg == 'blue' ? 'white' : 'black'};
//     paddingf: 10px;
// `

function Detail(props) {

    let [alert, setAlert] = useState(true);

    // useEffect 내부에 작성된 코드는 html 렌더링 후에 동작
    // 예를 들어, 복잡한 연산을 수행해야 할 때, useEffect() 내부에 작성을 하게 되면
    // 보다 빠르게 html을 보여줘 효율적인 플랫폼 제공

    // 그래서 useEffect 안에 적는 코드들은
    // 1. 어려운 연산
    // 2. 서버에서 데이터를 가져오는 작업
    // 3. timer 등

    // useEffect라는 이름을 쓰는 이유는
    // 함수의 핵심적인 기능 외의 'side effect'에서 따옴
    // 다시말해, useEffect는 side effect 보관함임
    // mount, update 시 여기에 작성한 코드가 실행
    useEffect(() => {
        let a = setTimeout(() => { setAlert(false); }, 2000);
        return () => { clearTimeout(a) };
    }, []);

    let [count, setCount] = useState(0);

    let { id } = useParams();
    let goods = props.shoes.find(function (x) {
        return x.id == id;
    });

    return (
        <div className="container">
            {
                alert == true
                    ? <div className="alert alert-warning">
                        2초 이내 구매시 할인
                    </div>
                    : null
            }
            {/* <YellowButton bg='blue'>버튼</YellowButton> */}
            <button onClick={() => { setCount(count + 1) }}>버튼</button>
            {count}
            <div className="row">
                <div className="col-md-6">
                    <img src="https://codingapple1.github.io/shop/shoes1.jpg" width="100%" />
                </div>
                <div className="col-md-6">
                    <h4 className="pt-5">{goods.title}</h4>
                    <p>{goods.content}</p>
                    <p>{goods.price}</p>
                    <button className="btn btn-danger">주문하기</button>
                </div>
            </div>
        </div>
    );
}

export default Detail;