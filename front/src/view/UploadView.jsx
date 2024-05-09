import {useState} from 'react';
import {useNavigate} from "react-router-dom";
import {Button, Upload, Input, Form, Card, Typography, message} from "antd";
import {UploadOutlined, CloseOutlined} from '@ant-design/icons';
import {Col, Row, Space, Divider} from "antd";



function UploadView() {
    let navigate = useNavigate();
    const [form] = Form.useForm()

    const props_odd = {
        name: 'file',
        action: 'http://localhost:5174/upload/odd',
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

    const props_multiple = {
        name: 'file',
        action: 'http://localhost:5174/upload/multiple',
        headers: {
            authorization: 'authorization-text',
        },
        data: {
            testpayload: "testpayload",
            form: ""
        },
        onChange(i) {
            // console.log(form.getFieldsValue())
            if (i.file.status !== 'uploading') {
                console.log(i.file, i.fileList);
            }
            if (i.file.status === 'done') {
                message.success(`${i.file.name} file uploaded successfully`);
                localStorage.setItem('result', JSON.stringify(i.file.response))
                console.log(localStorage.getItem('result'))
                // navigate('/')
            } else if (i.file.status === 'error') {
                message.error(`${i.file.name} file upload failed.`);
            }
        },
    }

    const onValueChange = (changedValues, allValues) => {
        // console.log('Changed values: ', changedValues);
        // console.log('All values: ', allValues);
        props_multiple.data.form = JSON.stringify(allValues);
        // console.log(props_multiple.data.form)
    };



    return (
        <div>
            <h1>Upload Your Python File</h1>
            <Upload {...props_odd}>
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
            <Divider />
            <h1>Upload Your Python File and Specify Envs</h1>
            <Form
                labelCol={{
                    span: 6,
                }}
                wrapperCol={{
                    span: 18,
                }}
                form={form}
                onValuesChange={onValueChange}
                name="dynamic_form_complex"
                style={{
                    maxWidth: 600,
                }}
                autoComplete="off"
                initialValues={{
                    envs: [{}],
                }}
            >
                <Form.List name="envs">
                    {(fields, { add, remove }) => (
                        <div
                            style={{
                                display: 'flex',
                                rowGap: 16,
                                flexDirection: 'column',
                            }}
                        >
                            {fields.map((field) => (
                                <Card
                                    size="small"
                                    title={`Environment ${field.name + 1}`}
                                    key={field.key}
                                    extra={
                                        <CloseOutlined
                                            onClick={() => {
                                                remove(field.name);
                                            }}
                                        />
                                    }
                                >
                                    <Form.Item label="Version" name={[field.name, 'version']}>
                                        <Input />
                                    </Form.Item>

                                    <Form.Item label="Libraries">
                                        <Form.List name={[field.name, 'libraries']}>
                                            {(subFields, subOpt) => (
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        rowGap: 16,
                                                    }}
                                                >
                                                    {subFields.map((subField) => (
                                                        <Space key={subField.key}>
                                                            <Form.Item noStyle name={[subField.name, 'library']}>
                                                                <Input placeholder="library" />
                                                            </Form.Item>
                                                            <Form.Item noStyle name={[subField.name, 'libversion']}>
                                                                <Input placeholder="libversion" />
                                                            </Form.Item>
                                                            <CloseOutlined
                                                                onClick={() => {
                                                                    subOpt.remove(subField.name);
                                                                }}
                                                            />
                                                        </Space>
                                                    ))}
                                                    <Button type="dashed" onClick={() => subOpt.add()} block>
                                                        + Add Sub Item
                                                    </Button>
                                                </div>
                                            )}
                                        </Form.List>
                                    </Form.Item>
                                </Card>
                            ))}

                            <Button type="dashed" onClick={() => add()} block>
                                + Add Item
                            </Button>
                        </div>
                    )}
                </Form.List>
                <Form.Item noStyle shouldUpdate>
                    {() => (
                        <Typography>
                            <pre>{JSON.stringify(form.getFieldsValue(), null, 2)}</pre>
                        </Typography>
                    )}
                </Form.Item>

            </Form>
            <Upload {...props_multiple}>
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
        </div>
    );
}

export {UploadView};
