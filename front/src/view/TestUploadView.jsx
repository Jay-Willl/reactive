import React, { useState } from 'react';
import { Upload, Button, Input } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const TestUploadView = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const uploadProps = {
        name: 'file',
        action: 'http://localhost:5174/upload/test_multiple', // 这是你的服务器端接口地址
        data: {
            name: name,  // 从状态中读取的用户名
            email: email  // 从状态中读取的邮箱
        },
        headers: {
            authorization: 'authorization-text',  // 如有需要，可以设置额外的头部信息
        },
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                console.log(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                console.log(`${info.file.name} file upload failed.`);
            }
        },
    };

    return (
        <div>
            <Input placeholder="Enter your name" value={name} onChange={e => setName(e.target.value)} />
            <Input placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} />
            <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
        </div>
    );
};

export {TestUploadView};
