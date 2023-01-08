/* eslint-disable */

import { useState } from 'react';
import { Container, Nav, Navbar, Button } from 'react-bootstrap';
import { Routes, Route, Link, useNavigate, Outlet } from 'react-router-dom';

// Components imported
import './App.css';
import data from './data.js';
import Detail from './routes/Detail.js';
import EventPage from './routes/EventPage';

// 실제로는 서버에서 가져온 데이터를 변수에 담아서 사용

// react bootstrap 외부 라이브러리
// App.js 는 쇼핑몰 메인 페이지
function App() {
  let [shoes, setShoes] = useState(data); // data파일의 data를 가져와서 shoe라는 state로 사용
  let navigate = useNavigate(); // 페이지 이동을 도와주는 hook

  // 사실 요 아래 return 부분이 웹 페이지의 전부...
  // 나머지는 각각의 component로 존재
  // 오호...
  return (
    <div className="App">

      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">ShoeShop</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link onClick={() => navigate('/')}>Home</Nav.Link>
            <Nav.Link onClick={() => navigate('./detail')}>Detail</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <Link to="/">Main</Link>
      <Link to="/detail">Detail</Link>

      <Routes>
        <Route path='/' element={<Main shoes={shoes} setShoes={setShoes} />} />

        <Route path='/detail/:id' element={<Detail shoes={shoes} />} />

        <Route path='/about' element={<About shoes={shoes} />}>
          <Route path='member' element={<div>멤버임</div>} />
          <Route path='location' element={<div>위치정보임</div>} />
        </Route>
        <Route path='/event' element={<EventPage></EventPage>}>
          <Route path='one' element={<p>첫 주문시 양배추즙 서비스</p>}></Route>
          <Route path='two' element={<p>생일기념 쿠폰받기</p>}></Route>
        </Route>
        <Route path='*' element={<div>404 Page</div>} />
      </Routes>

    </div >
  );
}

function Main(props) {
  let shoes = props.shoes;
  return (
    <>
      <div className="main-bg"></div>
      <div className="container">
        <div className="row">
          {
            shoes.map((a, i) => {
              return (
                <Card shoes={shoes[i]} i={i} key={i} />
              )
            })
          }
        </div>
        <Button variant="outline-success" onClick={() => {
          let copy = [...shoes];
          copy.sort();
          props.setShoes(copy);
        }}>정렬</Button>
      </div>
    </>
  )
}

function About() {
  return (
    <div>
      <h4>회사정보임</h4>
      <Outlet></Outlet>
    </div>
  )
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
