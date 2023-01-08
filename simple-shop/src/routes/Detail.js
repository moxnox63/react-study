/* eslint-disabled */

import { useParams } from "react-router-dom";
import styled from "styled-components";

let YellowButton = styled.button`
    background: ${props => props.bg};
    color: ${props => props.bg == 'blue' ? 'white' : 'black'};
    paddingf: 10px;
`

function Detail(props) {
    let { id } = useParams();
    let goods = props.shoes.find(function (x) {
        return x.id == id;
    });

    return (
        <div className="container">
            <YellowButton bg='blue'>버튼</YellowButton>
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