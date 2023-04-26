import React, { useState } from 'react';
import UserToggle from '../components/UserToggle';
import ConsumerInfo from '../components/userInfo/ConsumerInfo';
import VendorInfo from '../components/userInfo/VendorInfo';
import Auth from '../utils/auth';
import { Redirect } from 'react-router-dom'
import { Navigate, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { QUERY_SINGLE_PROFILE, GET_ME } from '../utils/queries';
import { useProductContext } from '../utils/GlobalState';
import { TOGGLE_VENDOR_STATUS } from '../utils/actions';

function Profile() {
    const { profileId } = useParams();
    // destructure refetch function and pass as a prop to consumerinfo component, then in that 
    const { loading, data } = useQuery(
        profileId ? QUERY_SINGLE_PROFILE : GET_ME,
        {
            variables: { profileId: profileId },
        },
    );

    const profile = data?.me || data?.profile || {};
    console.log(profile);

    // const [vendorStatus, setVendorStatus] = useState(false);
    const [state, dispatch] = useProductContext();
    const { vendorStatus } = state;
    const toggleVendorStatus = () => {
        dispatch({type: TOGGLE_VENDOR_STATUS})
    };

    // const user = {
    //     firstName: 'John',
    //     lastName: 'Doe',
    //     biography: 'I am John Doe.',
    //     vendorName: 'CSA Providence Farm',
    //     vendorDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed blandit sapien eu neque blandit, vel finibus urna tincidunt. Vivamus vel magna vestibulum, feugiat quam sed, molestie quam.',
    //     address: '123 Main St, Providence RI, USA',
    //     vendorAddress: '456 Water St, Providence RI, USA',
    //     email: 'johndoe@gmail.com',
    //     memberships: 'Silver Tier',
    //     vendorStatus
    // };

    const handleSave = (data) => {
        // setDescription(data.description);
        console.log('need data from database');
    };

    // // Old version
    // const toggleVendorStatus = () => {
    //     setVendorStatus(!vendorStatus);
    // };

    if (Auth.loggedIn()) { // should render profile only if user is logged in. ...should.  It can be reused to render other user's profile by different routes with user._id  .
        return (
            <div className='container'>
                {/* this toggle button needs to be moved to navBar when implementing */}
                <UserToggle vendorStatus={vendorStatus} onToggle={toggleVendorStatus} />
                <div className="container mt-5">
                    {vendorStatus ? <VendorInfo {...profile} onSave={handleSave} /> : <ConsumerInfo {...profile} onSave={handleSave} />}
                </div>
            </div>
        );
    } else {
        return (
            <Redirect to={{ pathname: '/login' }}></Redirect>)
    }
}

export default Profile;
