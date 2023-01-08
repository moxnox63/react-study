/* eslint-disable */

import { useState } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import './App.css';
import data from './data.js';

// 실제로는 서버에서 가져온 데이터를 변수에 담아서 사용

// react bootstrap 외부 라이브러리
// App.js 는 쇼핑몰 메인 페이지
function App() {
  let [shoes, setShoes] = useState(data); // data파일의 data를 가져와서 shoe라는 state로 사용

  return (
    <div className="App">
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">ShoeShop</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#features">Cart</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <div className="main-bg"></div>

      <div className="container">
        <div className="row">

          {
            shoes.map((a, i) => {
              return (
                <Card shoes={shoes[i]} i={i} />
              )
            })
          }

          {/* <Card shoes={shoes[0]} i={0} />
          <Card shoes={shoes[1]} i={1} />
          <Card shoes={shoes[2]} i={2} /> */}

          {/* <div className="col-md-4">
            <img src='https://codingapple1.github.io/shop/shoes1.jpg' width="80%" />
            <h4>{shoes[0].title}</h4>
            <p>{shoes[0].content}</p>
            <p>{shoes[0].price}</p>
          </div>
          <div className="col-md-4">
            <img src='https://codingapple1.github.io/shop/shoes2.jpg' width="80%" />
            <h4>{shoes[1].title}</h4>
            <p>{shoes[1].content}</p>
            <p>{shoes[1].price}</p>
          </div>
          <div className="col-md-4">
            <img src='https://codingapple1.github.io/shop/shoes3.jpg' width="80%" />
            <h4>{shoes[2].title}</h4>
            <p>{shoes[2].content}</p>
            <p>{shoes[2].price}</p>
          </div> */}
        </div>
      </div>
    </div >
  );
}

function Card(props) {
  return (
    <div className="col-md-4">
      <img src={'https://codingapple1.github.io/shop/shoes' + (props.i + 1) + '.jpg'} width="80%" />
      <h4>{props.shoes.title}</h4>
      <p>{props.shoes.content}</p>
      <p>{props.shoes.price}</p>
    </div>
  )
}

export default App;
