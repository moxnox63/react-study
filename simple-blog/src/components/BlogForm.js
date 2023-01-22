import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { bool } from "prop-types";

const BlogForm = ({ editing }) => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [originalTitle, setOriginalTitle] = useState('');
    const [originalBody, setOriginalBody] = useState('');
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');

    useEffect(() => {
        if (editing) {
            axios.get(`http://localhost:3001/posts/${id}`)
                .then((res) => {
                    setTitle(res.data.title);
                    setOriginalTitle(res.data.title);
                    setBody(res.data.body);
                    setOriginalBody(res.data.body);
                });
        }
    }, [id, editing]);

    const isEdited = () => {
        return title !== originalTitle || body !== originalBody;
    }

    const onSubmit = () => {
        if (editing) {
            axios.put(`https://localhost:3001/posts/${id}`, {
                title,
                body,
            }).then(res => {
                console.log(res);
                navigate(`/blogs/${id}`);
            })
        } else {
            axios.post('http://localhost:3001/posts', {
                title,
                body,
                createdAt: Date.now()
            }).then(() => {
                navigate("/blogs");
            })
        }

    };
    return (
        <div>
            <h1>{editing ? "Edit" : "Create"} a Blog Post</h1>
            <div className="mb-3">
                <label className="form-label">Title</label>
                <input
                    className="form-control"
                    value={title}
                    onChange={(event) => {
                        setTitle(event.target.value);
                    }}
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Body</label>
                <textarea
                    className="form-control"
                    value={body}
                    onChange={(event) => {
                        setBody(event.target.value);
                    }}
                    rows="10"
                />
            </div>
            <button
                className="btn btn-primary"
                onClick={onSubmit}
                disabled={editing && !isEdited()}
            >
                {editing ? "Edit" : "Post"}
            </button>
        </div>);
}

BlogForm.propTypes = {
    editing: bool
}

BlogForm.defaultProps = {
    editing: false
}

export default BlogForm;