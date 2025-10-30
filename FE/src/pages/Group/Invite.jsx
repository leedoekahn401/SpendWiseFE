import { Spin, List, Button, Avatar, Empty, notification,Card } from "antd";
import { API_PATH } from "../../utils/apiPath";
import instance from "../../utils/instance";
import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";

const InvitesPage = () => {
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInvites = async () => {
    try {
      setLoading(true);
      const response = await instance.get(API_PATH.INVITE.GET_INVITES);
      setInvites(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      notification.error({
        message: "Cant load invitation list",
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchInvites();
  }, []);
  const handleAction = async (inviteId, action) => {
    try {
      if (action === "accept") {
        await instance.post(`${API_PATH.INVITE.ACCEPT_INVITE}/${inviteId}`);
        notification.success({
          message: "Accepted",
        });
        window.location.reload();
      } else {
        await instance.post(`${API_PATH.INVITE.DECLINE_INVITE}/${inviteId}`);
        notification.info({
          message: "Declined",
        });
      }
      setInvites((prevInvites) =>
        prevInvites.filter((invite) => invite._id !== inviteId)
      );
    } catch (error) {
      notification.error({ message: `Cant ${action} invite` });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        {" "}
        <Spin size="large" />{" "}
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6"> Invitations </h1>
      <div className="shadow-sm rounded-md border border-gray-200 p-4 md:p-6 h-[600px] overflow-y-auto">
        {invites.length === 0 ? (
          <Empty description="No invitations."  className="h-full flex-col flex items-center justify-center"/>
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={invites}
            renderItem={(invite) => (
              <List.Item
                actions={[
                  <Button
                    type="primary"
                    icon={<Check size={16} />}
                    onClick={() => handleAction(invite._id, "accept")}
                  >
                    Accept
                  </Button>,

                  <Button
                    danger
                    icon={<X size={16} />}
                    onClick={() => handleAction(invite._id, "decline")}
                  >
                    Decline
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      src={invite.inviter.profilePic}
                      size={50}
                      className="ring ring-gray-500"
                    />
                  }
                  title={<span> {invite.group.name} </span>}
                  description={
                    <span>
                      Sent by {invite.inviter.username} at {new Date(invite.createdAt).toLocaleString()}
                    </span>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </div>
    </div>
  );
};

export default InvitesPage;