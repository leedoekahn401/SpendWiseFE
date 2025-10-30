import { Modal, Form, Input, Radio,InputNumber,Button } from "antd";

const AddTransModal = ({visible,onCancel,onSubmit}) => {
    const [form] = Form.useForm();
    const handleSubmit = (values) => {
        onSubmit(values);
        form.resetFields();
    };
    
    return (
        <Modal title="Add Transaction" open={visible}  onCancel={onCancel} footer={null}>
            <Form form={form} layout="vertical" onFinish={handleSubmit} >
                <Form.Item name="category" label="Category" rules={[{ required: true }]}>
                    <Input placeholder="Groceries, Rent, Salary, etc."/>
                </Form.Item>
                <Form.Item name="type" label="Type" rules={[{ required: true }]}>
                    <Radio.Group >
                        <Radio value="income">Income</Radio>
                        <Radio value="expense">Expense</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item name="amount" label="Amount" rules={[{ required: true }]}>
                    <InputNumber prefix="$" min={0}  style={{width:"100%"}} placeholder="0.00" />
                </Form.Item>
                <Form.Item name="description" label="Description">
                    <Input placeholder="Description"/>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" block>Submit</Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};
export default AddTransModal;
