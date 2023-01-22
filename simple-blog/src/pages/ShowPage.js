import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import LoadingSpinner from "../components/LoadingSpinner";

const ShowPage = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null); // 처음에는 비어있다가
    const [loading, setLoading] = useState(true);

    const getPosts = (id) => {
        axios.get(`http://localhost:3001/posts/${id}`).then((res) => {
            setPost(res.data); // 서버와 통신해서 데이터를 받아옴
            setLoading(false); // 데이터 받아지면 loading은 false
        })
    };

    useEffect(() => {
        getPosts(id);
    }, []); // 여기 []는 의존성 배열!

    if (loading) {
        return <LoadingSpinner />
    }

    return (
        <div>
            <h1>{post.title}</h1>
            <p>{post.body}</p>
        </div>
    );
};

export default ShowPage;