import { Dropdown, Button } from "antd";
const DropDown = ({ title, items = [], onSelect }) => {
    const handleMenuClick = (e) => {
        if (onSelect) {
            onSelect(e.key);
        }
    };
    return (
        <Dropdown menu={{ items, onClick: handleMenuClick }} placement="bottom">
            <Button className="hover:shadow-md hover:shadow-blue-200 transition-all duration-300 mb-4">{title}</Button>
        </Dropdown>
    );
};

export default DropDown;