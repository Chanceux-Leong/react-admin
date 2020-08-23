import React, { Component, Fragment } from "react";
// antd
import { Form, Input, InputNumber, Button, Radio, message } from "antd";
// API
import { DepartmentAddApi, Detailed, Edit } from "@/api/department";
// 组件
import FormCom from "@c/form/Index";
class DepartmentAdd extends Component {
    constructor(props){
        super(props);
        this.state = {
            loading: false,
            id: "",
            formLayout: {
                labelCol: { span: 2 },
                wrapperCol: { span: 20 }
            },
            formItem: [
                { type: "Input",  label: "部门名称", name: "name", required: true },
                { type: "Select",  label: "部门aaaa名称", name: "namea", required: true },
            ]
        };
    }

    componentWillMount(){
        if(this.props.location.state) {
            this.setState({
                id: this.props.location.state.id
            })
        }
    }

    componentDidMount(){
        this.getDetailed();
    }

    getDetailed = () => {
        if(!this.props.location.state) { return false }
        Detailed({id: this.state.id}).then(response => {
            this.refs.form.setFieldsValue(response.data.data);
        })
    }

    onSubmit = (value) => {
        if(!value.name) {
            message.error("部门名称不能为空");
            return false;
        }
        if(!value.number || value.number === 0) {
            message.error("人员数量不能为0");
            return false;
        }
        if(!value.content) {
            message.error("描述不能为空");
            return false;
        }
        this.setState({
            loading: true
        })
        // 确定按钮执行添加或编辑
        this.state.id ? this.onHandlerEdit(value) : this.onHandlerAdd(value);
        
    }
    /** 添加信息 */
    onHandlerAdd = (value) => {
        DepartmentAddApi(value).then(response => {
            const data = response.data;
            message.info(data.message);
            this.setState({
                loading: false
            })
            // 重置表单
            this.refs.form.resetFields();
        }).catch(error => {
            console.log('errorerrorerrorerrorerror')
            console.log(error)
        })
    }
    /** 编辑信息 */
    onHandlerEdit = (value) => {
        const requestData = value;
        requestData.id = this.state.id;
        Edit(requestData).then(response => {
            const data = response.data;
            message.info(data.message)
            this.setState({
                loading: false
            })
        }).catch(error => {
            this.setState({
                loading: false
            })
        })
    }
    render(){
        return (
            <Fragment>
                <FormCom formItem={this.state.formItem} />
                <Form ref="form" onFinish={this.onSubmit} initialValues={{ status: true, number: 0}} {...this.state.formLayout}>
                    <Form.Item label="部门名称" name="name" rules={[
                                    {
                                        required:true,
                                        message:'用户名不能为空'
                                    },
                                    {
                                        min:5,max:10,
                                        message:'长度不在范围内'
                                    },
                                    {
                                        pattern:new RegExp('^\\w+$','g'),
                                        message:'用户名必须为字母或者数字'
                                    }
                                ]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="人员数量" name="number">
                        <InputNumber min={0} max={100} />
                    </Form.Item>

                    <Form.Item label="禁启用" name="status">
                        <Radio.Group>
                            <Radio value={false}>禁用</Radio>
                            <Radio value={true}>启用</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item label="描述" name="content">
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item>
                        <Button loading={this.state.loading} type="primary" htmlType="submit">确定</Button>
                    </Form.Item>
                </Form>
          </Fragment>
        )
    }
}
// export default Form.create()(DepartmentAdd);
export default DepartmentAdd;