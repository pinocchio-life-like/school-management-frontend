import { Divider, List, Typography } from "antd";
import Title from "antd/es/typography/Title";
const data = [
  "Racing car sprays burning fuel into crowd.",
  "Japanese princess to wed commoner.",
  "Australian walks 100km after outback crash.",
  "Man charged over missing wedding girl.",
  "Los Angeles battles huge wildfires.",
];
const DetailTable = () => (
  <>
    <Divider orientation="left" style={{ marginTop: 19 }}>
      <Title style={{ marginTop: 10 }} level={4}>
        Guardian and Other Information
      </Title>
    </Divider>
    <List
      style={{
        textAlign: "left",
        boxShadow:
          "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
      }}
      bordered>
      <List.Item>
        Admission Date:
        <span style={{ marginLeft: 250 }}>13-05-2023</span>
      </List.Item>
      <List.Item>
        Roll Number:<span style={{ marginLeft: 270 }}>1034</span>
      </List.Item>
      <List.Item>
        Mobile Number:<span style={{ marginLeft: 248 }}>+235943445745</span>
      </List.Item>
      <List.Item>
        <h3 style={{ margin: 0 }}>Address Detail</h3>
      </List.Item>
      <List.Item>
        Province:<span style={{ marginLeft: 294 }}>Yeka</span>
      </List.Item>
      <List.Item>
        Street:<span style={{ marginLeft: 310 }}>Megenagna</span>
      </List.Item>
      <List.Item>
        House Number:<span style={{ marginLeft: 252 }}>8723</span>
      </List.Item>
      <List.Item>
        <h3 style={{ margin: 0 }}>Parent / Guardian Detail</h3>
      </List.Item>
      <List.Item>
        Guardian Name:<span style={{ marginLeft: 250 }}>Wick Adams</span>
      </List.Item>
      <List.Item>
        Guardian Relation:<span style={{ marginLeft: 237 }}>Father</span>
      </List.Item>
      <List.Item>
        Guardian Mobile Number:
        <span style={{ marginLeft: 186 }}>+2519546753</span>
      </List.Item>
    </List>
  </>
);
export default DetailTable;
