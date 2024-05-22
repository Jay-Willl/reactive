import {useState} from 'react';
import {useNavigate} from "react-router-dom";
import {Button, Upload, Input, Form, Card, Typography, message, Collapse} from "antd";
import {UploadOutlined, CloseOutlined} from '@ant-design/icons';
import {Col, Row, Space, Divider} from "antd";


const text1 = `
    This is the Python Performance Profiling user interface.
    Please select the file which you want to upload, and click the 'upload' button below.
`;

const text2 = `
    If you want to compare the difference between different execution environment, 
    please specify if using the second column. 'Mission Set Name' is used as an global ID.
`;

const text3 = `
    Please make sure that docker is installed to your computer and is running.
    Please copy the source code and run 'docker compose up'.
`;

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

    const props_collection = {
        name: 'file',
        action: 'http://localhost:5174/upload/collection',
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
                // navigate('/')
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
        <Row gutter={[0, 0]}>
            <Col span={8} className='uploadview-cell'>
                <div>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <h1>Introduction</h1>
                    </div>

                    <Divider/>

                    <Collapse
                        items={[{
                            key: '1',
                            label: 'Introduction',
                            children: <p>{text1}</p>
                        }]}
                    />

                    <br />

                    <Collapse
                        items={[{
                            key: '1',
                            label: 'Usage',
                            children: <div><p>{text2}</p><p><em>{text3}</em></p></div>
                        }]}
                    />

                    <br />

                    <Collapse
                        items={[{
                            key: '1',
                            label: 'Backend Deployment Instruction',
                            children: <p>{text3}</p>
                        }]}
                    />

                    <Divider />
                </div>
            </Col>
            <Col span={8} className='uploadview-cell'>
                <div>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <h1>Upload Python File</h1>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <Upload {...props_odd}>
                            <Button icon={<UploadOutlined/>}>Click to Upload</Button>
                        </Upload>
                    </div>

                    <br/>
                    <Divider/>

                </div>

                <div>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <h1>Explore More Plots</h1>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <Upload {...props_collection}>
                            <Button icon={<UploadOutlined/>}>Click to Upload</Button>
                        </Upload>
                    </div>

                    <br/>
                    <Divider/>

                </div>
            </Col>
            <Col span={8} className='uploadview-cell'>
                <div>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <h1>Specify Running Envs</h1>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <Upload {...props_multiple}>
                            <Button icon={<UploadOutlined/>}>Click to Upload</Button>
                        </Upload>
                    </div>

                    <br/>
                    <Divider/>

                    <div>
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
                            <Divider orientation="left">Specify Mission Set ID</Divider>
                            <Form.Item label="Mission Set ID" labelAlign="left" name="setname">
                                <Input/>
                            </Form.Item>
                            <Divider orientation="left">Specify Environments</Divider>
                            <Form.List name="envs">
                                {(fields, {add, remove}) => (
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
                                                    <Input/>
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
                                                                        <Form.Item noStyle
                                                                                   name={[subField.name, 'library']}>
                                                                            <Input placeholder="library"/>
                                                                        </Form.Item>
                                                                        <Form.Item noStyle
                                                                                   name={[subField.name, 'libversion']}>
                                                                            <Input placeholder="libversion"/>
                                                                        </Form.Item>
                                                                        <CloseOutlined
                                                                            onClick={() => {
                                                                                subOpt.remove(subField.name);
                                                                            }}
                                                                        />
                                                                    </Space>
                                                                ))}
                                                                <Button type="dashed" onClick={() => subOpt.add()}
                                                                        block>
                                                                    + Add Library
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </Form.List>
                                                </Form.Item>
                                            </Card>
                                        ))}

                                        <Button type="dashed" onClick={() => add()} block>
                                            + Add Environment
                                        </Button>
                                    </div>
                                )}
                            </Form.List>
                            <Divider orientation="left">Preview Environments</Divider>
                            <Form.Item noStyle shouldUpdate>
                                {() => (
                                    <Typography>
                                        <pre>{JSON.stringify(form.getFieldsValue(), null, 2)}</pre>
                                    </Typography>
                                )}
                            </Form.Item>

                        </Form>
                    </div>
                    <Divider/>
                </div>
            </Col>

            <Col span={24} className='uploadview-footer'>
                <div
                    style={{
                        textAlign: 'center',
                        verticalAlign: 'middle',
                    }}
                >
                    Reactive @ {new Date().getFullYear()} | Created by Jay-Willl @ SUSTech | 12013016
                </div>
            </Col>
        </Row>
    );
}

export {UploadView};
