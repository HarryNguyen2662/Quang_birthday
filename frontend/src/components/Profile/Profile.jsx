import React, { useState, useEffect, useCallback } from 'react';
import styles from './Profile.module.css';
import { Card, Button } from 'react-bootstrap';
import { AvatarCarousel, handleChosenAvatar } from './AvatarCarousel';
import { createAvatar } from '@dicebear/core';
import { bigSmile } from '@dicebear/collection';
import { thumbs } from '@dicebear/collection';
import axios, { all } from 'axios';
//import Wheel from './WheelComponent';
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import {
  setPoints,
  setTotalPoints,
  setAvatar,
  setPurchasedAvatar,
  setLevel,
  setAllAvatars,
  setBio,
} from '../../slices/UserStateSlice';

const Profile = () => {
  const exampleTokenForPhuoc = JSON.parse(localStorage.getItem('user')).token;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  //redux toolkit
  const dispatch = useDispatch();
  const winner = useSelector(state => state.setWinner.value);
  const purchasedAvatar = useSelector(state => state.UserState.purchasedAvatar);
  const points = useSelector(state => state.UserState.points);
  const totalpoints = useSelector(state => state.UserState.totalpoints);
  const level = useSelector(state => state.UserState.level);
  const avatar = useSelector(state => state.UserState.avatar);
  const allAvatars = useSelector(state => state.UserState.allAvatars);
  const bio = useSelector(state => state.UserState.bio);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8888/api/users/getUser',
          {
            headers: {
              Authorization: `Bearer ${exampleTokenForPhuoc}`,
            },
          },
        );
        setName(response.data.username);
        setEmail(response.data.email);

        // use redux toolkit
        await dispatch(setPoints(response.data.points));
        await dispatch(setTotalPoints(response.data.totalpoints));
        await dispatch(setPurchasedAvatar(response.data.purchasedAvatars));
        await dispatch(setBio(response.data.bio));
        console.log(bio);

        // if avatar is default, chaneg it so that it appear as initials of user
        // else set current avatar of user
        if (
          response.data.purchasedAvatars[0][0] ===
          'https://api.dicebear.com/6.x/initials/svg?seed=default'
        ) {
          await dispatch(
            setAvatar(
              'https://api.dicebear.com/6.x/initials/svg?seed=' +
                response.data.username,
            ),
          );
        } else {
          console.log(purchasedAvatar);
          await dispatch(setAvatar(response.data.purchasedAvatars[0][0]));
        }
      } catch (error) {
        console.log('There is something wrong with fetching user info');
      }
    };

    fetchUser();

    setIsLoading(false);
  }, [points, dispatch]);
  useEffect(() => {
    const fetchAvatars = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8888/api/users/getAvatars',
          {
            headers: {
              Authorization: `Bearer ${exampleTokenForPhuoc}`,
            },
          },
        );
        await dispatch(setAllAvatars(response.data));
      } catch (error) {
        console.log('There is something wrong with fetching avatars');
      }
    };
    fetchAvatars();
  }, [purchasedAvatar, dispatch]);

  const handleUpdateBio = async () => {
    try {
      let newBio = prompt('Please enter your new bio: ');
      if (newBio === null || newBio === '') {
        toast.error('You have to fill in the box');
        return;
      }
      const response = await axios.put(
        `http://localhost:8888/api/users/update`,
        { bio: newBio },
        {
          headers: {
            Authorization: `Bearer ${exampleTokenForPhuoc}`,
          },
        },
      );
      dispatch(setBio(newBio));
      console.log('bio in handle', newBio);
    } catch (error) {
      console.log('There is something wrong with update bio');
    }
  };

  // const handleTradeCustomAvatar = async () => {
  //   // TODO Logic for trading 500 points to change to a custom avatar
  //   try {
  //     //check if user have enough points
  //     if (points < 100) {
  //       toast.error('You do not have enough points');
  //       return;
  //     }
  //     console.log('level', level);
  //     let type = 'none';
  //     if (level === 1) {
  //       type = thumbs;
  //     } else if (level === 2) {
  //       type = bigSmile;
  //     } else {
  //       toast.error("Can't use this function for this level");
  //       return;
  //     }

  //     let seed = prompt('Please enter the name you want to make avatar with: ');
  //     if (seed === null || seed === '') {
  //       toast.error('You have to fill in the box');
  //       return;
  //     }

  //     const currentAvatar = createAvatar(type, {
  //       seed: seed,
  //     });
  //     console.log(seed);
  //     const avatarDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  //       currentAvatar.toString(),
  //     )}`;

  //     let tempAvatar = await dispatch(setAvatar(avatarDataUrl));
  //     let temp = JSON.parse(JSON.stringify(purchasedAvatar));
  //     temp[0][0] = tempAvatar.payload;
  //     console.log(temp);

  //     //update user infor on database
  //     const response = await axios.put(
  //       `http://localhost:8888/api/users/update`,
  //       { purchasedAvatars: temp, points: points - 100 },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${exampleTokenForPhuoc}`,
  //         },
  //       },
  //     );

  //     dispatch(setAvatar(response.data.purchasedAvatars[0][0]));
  //     dispatch(setPoints(response.data.points));
  //   } catch (error) {
  //     console.error(error);
  //     console.log('There is something wrong with update avatar');
  //   }
  // };

  const something = () => {};

  const handleChange = async e => {
    try {
      let value = e.target.value;
      dispatch(setLevel(Number(value)));
    } catch (error) {
      console.log('There is something wrong in level handling');
    }
  };

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div className={styles.viewport}>
      <Toaster />
      <div className={styles.pageTitle}>Customize your avatar!</div>

      <div className={styles.customization}>
        <div className={styles.sidebar}>
          {purchasedAvatar[0].length > 0 ? (
            <img
              src={`${avatar}`}
              alt="User Profile"
              onLoad={() => isLoading(false)}
              className={`${styles.image}`}
            />
          ) : (
            <p>This is a long loading state to test if it actually showing</p>
          )}

          <div className={styles.tablecontainer}>
            <div className={styles.row}>
              <div className={styles.title}>Username</div>
              <div className={styles.value}>{name}</div>
            </div>
            <div className={styles.row}>
              <div className={styles.title}>Email</div>
              <div className={styles.value}>{email}</div>
            </div>
            <div className={styles.row}>
              <div className={styles.title}>Current Points</div>
              <div className={styles.value}>{points}</div>
            </div>
            <div className={styles.row}>
              <div className={styles.title}>Total Points</div>
              <div className={styles.value}>{totalpoints}</div>
            </div>

            {bio != null ? (
              <div>
                <div className={styles.row}>
                  <div className={styles.title}>Bio</div>
                </div>
                <div className={styles.myBio}>{bio}</div>
                <Button
                  className={styles.tradeButton}
                  onClick={handleUpdateBio}
                >
                  Update Bio
                </Button>
              </div>
            ) : (
              <Button className={styles.tradeButton} onClick={handleUpdateBio}>
                Add Bio
              </Button>
            )}
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.upperRight}>
            <div className={styles.avatarSection}>
              <Card className={styles.cardContainer}>
                <Card.Body className={styles.cardBody}>
                  <div className={styles.pointTitle}>
                    Choose a unique avatar for 100 points!
                  </div>
                  <div classname={styles.levelContainer}>
                    <select
                      classname={styles.levelOption}
                      onChange={handleChange}
                    >
                      <option value="1">Level 1</option>
                      <option value="2">Level 2</option>
                      <option value="3">Level 3</option>
                    </select>
                  </div>
                  {/* ? : means if else. for ex : 1+1 ==2 ? print('right') : print('wrong') => result will be 'right' */}
                  {allAvatars.length > 0 ? (
                    // <AvatarCarousel />
                    <AvatarCarousel />
                  ) : // <AvatarCarousel level={level} allAvatars={allAvatars} />
                  null}
                  {/* <div className={styles.buttonContainer}> */}
                  {/* <Button
                      className={styles.tradeButton}
                      onClick={handleChosenAvatar}
                    >
                      Choose this avatar
                    </Button> */}
                  {/* <Button
                      className={styles.tradeButton}
                      onClick={handleTradeCustomAvatar}
                    >
                      Generate new avatar
                    </Button> */}
                  {/* </div> */}
                </Card.Body>
              </Card>
            </div>
          </div>

          <div className={styles.lowerRight}>
            <div className={styles.avatarSection}>
              <Card className={styles.cardContainer}>
                <div className={styles.pointTitle}>
                  Choose a random avatar for 50 points!
                </div>
                {/* <div className  */}
                {/*
																			<div className={styles.wheel}>
																				{allAvatars.length > 0 &&
																				purchasedAvatar[0].length > 0 ? (
																					<Wheel />
																				) : null}
																			</div>
                                      */}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
