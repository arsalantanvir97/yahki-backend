import axios from "axios";

const LoginSOASystem = async (id) => {
  const loginUser = await axios({
    url: `https://dev28.onlinetestingserver.com/soachatcentralizedWeb/api/login`,
    method: "POST",
    data: {
      appid: "add06e35baef788640b0d11db972ccc1",
      secret_key:
        "$2y$10$CGSjmPQHuJvkT5EM7lYU5exJ0B33ADW8C/fJX6YpCA6N/y41AE89e",
      id
    }
  });
  return loginUser.data.token;
};

const MakeFriends = async (fromid, toid) => {
  console.log(
    "MakeFriendsMakeFriendsMakeFriendsMakeFriendsMakeFriendsMakeFriends",
    fromid,
    toid
  );
  try {
    console.log(fromid, toid);
    await axios({
      url: `https://dev28.onlinetestingserver.com/soachatcentralizedWeb/api/user/add-friends`,
      method: "POST",
      data: {
        appid: "add06e35baef788640b0d11db972ccc1",
        secret_key:
          "$2y$10$CGSjmPQHuJvkT5EM7lYU5exJ0B33ADW8C/fJX6YpCA6N/y41AE89e",
        fromid: fromid,
        toid: toid,
        auto_accept: true
      }
    });
  } catch (err) {
    console.log(err);
  }
};

const addSoaUser = async (id, first_name) =>
  await axios({
    url: "https://dev28.onlinetestingserver.com/soachatcentralizedWeb/api/user/add",
    method: "POST",
    data: {
      appid: "add06e35baef788640b0d11db972ccc1",
      secret_key:
        "$2y$10$CGSjmPQHuJvkT5EM7lYU5exJ0B33ADW8C/fJX6YpCA6N/y41AE89e",
      id,
      name: `${first_name}`,
      avatar: "https://www.w3schools.com/w3images/avatar2.png"
    }
  });
  
export { LoginSOASystem, MakeFriends, addSoaUser };
