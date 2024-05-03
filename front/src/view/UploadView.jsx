import {useState} from 'react';
import {useNavigate} from "react-router-dom";
import {Button, Upload, message} from "antd";
import {UploadOutlined} from '@ant-design/icons';
import {Col, Row, Space} from "antd";



function UploadView() {
    let navigate = useNavigate();

    const props = {
        name: 'file',
        action: 'http://localhost:5174/upload/test',
        headers: {
            authorization: 'authorization-text',
        },
        onChange(i) {
            if (i.file.status !== 'uploading') {
                console.log(i.file, i.fileList);
            }
            if (i.file.status === 'done') {
                message.success(`${i.file.name} file uploaded successfully`);
                localStorage.setItem('result', JSON.stringify(i.file.response))
                console.log(localStorage.getItem('result'))
                navigate('/')
            } else if (i.file.status === 'error') {
                message.error(`${i.file.name} file upload failed.`);
            }
        },
    };


    return (
        <div>
            <h1>Upload Your Python File</h1>
            <Upload {...props}>
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
        </div>
    );
}

export {UploadView};
