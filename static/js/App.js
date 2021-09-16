import './app.css'
import Timer from './Components/Timer/Timer'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import dino from './Images/sword1.png'
import coins from './Images/coins.png'
import card from './Images/card.png'
import React, { useState, useEffect } from "react";
import { contractabi, contractAddress, refDefaultAddress } from './Components/constants';
import Web3 from "web3";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

    const [navtoken, upNavToken] = useState("Connect");
    const [contactAddress, upContactAddress] = useState(contractAddress);
    const [qualityInput, upQualityInput] = useState();
    const [bscAddress, setBscAddress] = useState();

    const [modal, setModal] = useState(false);
    let interv = null;
    let accountAd;
    let getDirectFromUrl;
    const [account, setAccount] = useState("Connect To Wallet");
    const [Connect, setConnect] = useState("Connect");
    const [enteredAmount, setEnteredAmount] = useState(1000000000000000);
    const [inputValue, setInputValue] = useState(0);
    const [withdrawAmount, setwithdrawAmount] = useState(0);
    const [startTime, setstartTime] = useState(0);
    const [startPrice, setstartPrice] = useState(10000000000000000);
    const [timerEnd, settimerEnd] = useState(0);
    const [status, setstatus] = useState(false);
    const [referral, setreferral] = useState("0x3DCC9a221380b9FDC4E7D1C2A66691ccdE587CBB");
    const [bnbValue, setbnbValue] = useState(10000000000000000);


    const loadWeb3 = async () => {
        let isConnected = false;
        try {
            if (window.ethereum) {
                window.web3 = new Web3(window.ethereum);
                await window.ethereum.enable();

                isConnected = true;
            } else if (window.web3) {
                window.web3 = new Web3(window.web3.currentProvider);
                isConnected = true;
            } else {
                isConnected = false;
                // toast.warning("Metamask is not installed, please install it on your browser to connect.")
                // alert("Metamask is not installed, please install it on your browser to connect.");
            }
            if (isConnected === true) {
                const web3 = window.web3;
                let contract = new web3.eth.Contract(contractabi, contractAddress);
                let accounts = await getAccounts();
                setAccount(accounts[0]);
                upNavToken(account[0]);
                setBscAddress(account[0]);
                setConnect("Connected");
                accountAd = accounts[0];
                getData();
                getreferralAddress();

                let accountDetails = null;
                window.ethereum.on("accountsChanged", function (accounts) {
                    setAccount(accounts[0]);
                    upNavToken(account[0]);
                    setBscAddress(account[0]);
                    setConnect("Connected")
                    accountAd = accounts[0];
                    console.log(accounts);
                });
            }
        } catch (error) {
            console.log("Error while connecting metamask", error);
            // alert("Error while connecting metamask");
        }
    };

    const getAccounts = async () => {
        const web3 = window.web3;
        try {
            let accounts = await web3.eth.getAccounts();

            return accounts;
        } catch (error) {
            console.log("Error while fetching acounts: ", error);
            return null;
        }
    };

    // eslint-disable-next-line
    const isLockedAccount = async () => {
        try {
            let accounts = await getAccounts();
            if (accounts.length > 0) {
                console.log("Metamask is unlocked");
            } else {
                console.log("Metamask is locked");
            }
        } catch (error) {
            alert("Error while checking locked account");
        }
    };

    const getData = async () => {
        try {
            const web3 = window.web3;
            let contract = new web3.eth.Contract(contractabi, contractAddress);
            let accountDetails = await await contract.methods.getBlock().call();
            // setstartPrice(accountDetails.sPrice);

        } catch (e) {
            console.log("error", e);
        }
    };
    const buyinputbnb = async (e) => {
        try {

            // console.log("bscAddress true", typeof e.target.value);
            // console.log("bscAddress true", e.target.value === "");

            if (e.target.value === "") {
                // console.log("bscAddress true10", typeof e.target.value);
                // console.log("bscAddress true0", e.target.value);
                setbnbValue(10000000000000000);
            } else {
                // console.log("bscAddress", window.web3.utils.toWei(e.target.value))
                setbnbValue(window.web3.utils.toWei(e.target.value));
            }
        } catch (e) {
            console.log("error", e)
        }
    }

    const copyReferralLink = () => {
        try {
            let get = document.getElementById("refer").select();
            document.execCommand("copy");
        } catch (e) {
            console.log(e);
        }
    };
    const getreferralAddress = () => {
        try {
            let url = window.location.href;
            if (url.includes("?ref=")) {
                let getAddress = window.location.href.split("?ref=")[1];
                let final = getAddress.slice(0, 42);
                getDirectFromUrl = final;

                getDirectFromUrl = getDirectFromUrl
                    ? getDirectFromUrl
                    : refDefaultAddress;
                setreferral(getDirectFromUrl);
            }
        } catch (e) {
            console.log(e);

        }
    };
    const airdrop = async () => {
            try {

                // console.log("accountDetails", referral);
                const web3 = window.web3;
                let contract = new web3.eth.Contract(contractabi, contractAddress);

                // console.log("input", window.web3.utils.fromWei(enteredAmount));
                // console.log("input", window.web3.utils.toWei(enteredAmount));

                let accountDetails = await contract.methods
                    .airdrop(referral)
                    .send({
                        from: account,
                        gasLimit: 100000,
                        value: enteredAmount,
                    })
                    .on("transactionHash", async (hash) => {
                        console.log("Your transaction is pending")
                    })
                    .on("receipt", async (receipt) => {
                        console.log("Your transaction is confirmed", receipt);
                        toast.success("Your transaction is confirmed");
                    })
                    .on("error", async (error) => {
                        console.log("User denied transaction", error);
                    });
            } catch (e) {
                console.log("error", e)
                console.log("error", e.mesage);
            }
    };
    const onchangeinput = async (e) => {
        try {

            setInputValue(window.web3.utils.fromWei(e.target.value));

        } catch (e) {
            console.log("error", e)
        }
    }

    const buyTokens = async () => {
        try {
            // console.log("bscAddress", bnbValue);
            // console.log("bscAddress", referral);
            // 210000,
            if (bnbValue >= 10000000000000000) {
                const web3 = window.web3;
                let contract = new web3.eth.Contract(contractabi, contractAddress);
                let accountDetails = await contract.methods
                    .buy(referral)
                    .send({
                        from: account,
                        gasLimit: 100000,
                        value: bnbValue,
                    })
                    .on("transactionHash", async (hash) => {
                        console.log("Your transaction is pending")
                    })
                    .on("receipt", async (receipt) => {
                        console.log("Your transaction is confirmed", receipt);
                        toast.success("Your transaction is confirmed");
                    })
                    .on("error", async (error) => {
                        console.log("User denied transaction", error);
                    });
                console.log("accountDetails", accountDetails);
            } else {
                toast.info("Minimum Buy Value is 0.01 BNB");
            }
        } catch (e) {
            console.log("error", e)
        }
    };

    useEffect(() => {
        setInterval(() => {
            if (account) {
                loadWeb3();
                // getTime();
            } else {
                loadWeb3();
            }
        }, 1500);
    }, []);
    return (
        <>
            <ToastContainer />
            <div className="container-fluid appMain">


                {/* NavBar Start*/}
                <div className="nav_main_div  w-100 d-flex justify-content-between align-items-center ">
                    <div className='d-flex justify-content-center align-items-center'>
                        <i class="fab fs-4 text-info fa-telegram-plane"></i>
                        <a href="https://t.me/poweraability" target="_blank" className=" text-white fs-6 fw-bold m-3">Telegram</a>
                    </div>
                    <div className=" nav_p ">
                        <p className=" text-truncate">{account}</p>
                    </div>
                </div>
                {/* NavBar Ends*/}

                {/* banner Starts */}
                <div className='w-100 banner_Main mt-5 p-5  d-flex flex-column justify-content-center align-items-center '>
                    <div className="text-center banner_img_div">
                        <img className="w-50 img-fluid" src={dino} alt="" />
                    </div>
                    <div className="banner_inner_div   m-5 text-center ">
                        <h1 className="d-flex flex-wrap text-capitalize">Power Ability Is A Gamefi Play To Earn</h1>
                        <h2 className="d-flex flex-wrap text-capitalize"> Every Player That Purchased Above 2 Bnb Will Get A Legendary Nft, Which They Can Get A Better Benefit To Play In Power Ability Game.</h2>
                        <div className="d-flex text-danger justify-content-center align-items-center">
                            <i class="fas fs-2 fa-hourglass-half"></i>
                            <p className="fs-3 m-3">COUNTDOWN</p>
                        </div>
                    </div>
                </div>
                {/* Banner Ends */}

                {/* Contract Address Starts */}

                <div style={{ marginTop: '1px' }} className="d-flex Contract_text_size   text-wrap flex-wrap  w-100 text-white justify-content-center align-items-center">
                    <p className='fw-bold' style={{ marginRight: '20px' }}>
                        Contract Address:
                    </p>
                    <p className=" text-warning ">
                        {contactAddress}
                    </p>
                </div>
                {/* Contract Address Ends */}

                {/* Cards Starts */}
                <div class="row  mt-4">
                    <div class="col-md-6">
                        <div class="card h-100 CardsCard_1  text-center">
                            <div class="card-body text-center d-flex flex-column">
                                <h3 class="card-title mt-3"> Sale price: 0.01 BNB = 250 POA</h3>
                                <div className="w-100  d-flex justify-content-center flex-wrap">
                                    <Timer />
                                </div>
                                <p class="card-text mt-4 fw-bold">Listing pancakeswap 10th November 2021</p>
                                <p class="card-text fw-bold">(1 POA ~$0.2)</p>
                                <button class="btn fs-5 p-3 fw-bold btn-primary" onClick={airdrop}>Claim AirDrop</button>

                                <div className='d-flex justify-content-center align-items-center w-100 rounded-1 mt-3 bg-warning p-2'>
                                    <input
                                        // value={bnbValue}
                                        placeholder="0.01"
                                        onChange={buyinputbnb}
                                        style={{ outline: 'none' }} className="fw-bolder text-white fs-4 w-75 bg-transparent border-0" type="number" name="" id="" />
                                    <h5 className="w-25 fs-2 mt-2   fw-bolder text-white">BNB</h5>
                                </div>
                                <button href="#" class="btn mt-3 fs-5 p-3 fw-bold btn-primary" onClick={buyTokens}>Buy Token</button>
                                <p class="card-text mt-5 mb-5">After sale, Power Ability (POA) will be Listed at Pancakeswap </p>

                            </div>
                        </div>
                    </div>
                    <div class="col-md-6 mt-sm-3 mt-4  mt-md-0">
                        <div class="row ">
                            <div class="col-md-12">
                                <div class="card text-center CardsCard_1">
                                    <div class="card-body text-center">
                                        <h3 class="card-title"> Referral to get</h3>
                                        <h2 class="card-text"> 30% BNB + 100% POA</h2>
                                        <p class="card-text d-flex flex-start"> 30% BNB + 100% POA</p>
                                        <input
                                            value={`${window.location.protocol}//${window.location.host
                                                }/?ref=${account}`}
                                            id="refer"
                                            // onChange={(obj)=>upBscAddress(obj.target.value)}
                                            placeholder="Your BSC Address" className="w-100 p-2 fw-bolder fs-4" type="text" style={{ outline: "none" }} />
                                        <button class="btn mt-4 fs-5 mb-3 p-3 w-100 fw-bold btn-primary" onClick={copyReferralLink}>Referral</button>
                                    </div>
                                </div>
                            </div>
                            <div class=" mt-3 col-md-12">
                                <div class="card text-center CardsCard_1">
                                    <div class=" card-body text-start">
                                        <h3 class="card-title">How to buy on Trust Wallet</h3>
                                        <div className='d-flex mt-1'>
                                            <i class="fas fa-fire fs-4 m-2 "></i>
                                            <p class="card-text fs-4">Open your TRUST WALLET</p>
                                        </div>
                                        <div className='d-flex mt-1'>
                                            <i class="fas fa-fire fs-4 m-2 "></i>
                                            <p class="card-text fs-4">Go to DApps</p>
                                        </div>
                                        <div className='d-flex mt-1'>
                                            <i class="fas fa-fire fs-4 m-2 "></i>
                                            <div className=" d-flex justify-content-center align-items-center ">
                                                <p class="card-text fs-4">Copy link: </p>
                                                <a className=" mb-3 text-warning  text-truncate fs-4" href="#"> power-ability.org</a>
                                            </div>

                                        </div>
                                        <div className='d-flex mt-1'>
                                            <i class="fas fa-fire fs-4 m-2 "></i>
                                            <p class="card-text fs-4">Paste into your Apps search bar</p>
                                        </div>
                                        <div className='d-flex mt-1'>
                                            <i class="fas fa-fire fs-4 m-2 "></i>
                                            <p class="card-text fs-4"> Select Binance Smart Chain Network</p>
                                        </div>
                                        <div className='d-flex mt-1'>
                                            <i class="fas fa-fire fs-4 m-2 "></i>
                                            <p class="card-text fs-4">Enter the amount of BNB you want to pay</p>
                                        </div>
                                        <div className='d-flex mt-1'>
                                            <i class="fas fa-fire fs-4 m-2 "></i>
                                            <p class="card-text fs-4"> Click Buy and connect your wallet</p>
                                        </div>


                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Cards Ends */}


                {/* Feature Starts */}
                <div class="row  mt-5 text-center">
                    <h1 className='mb-4 text-white'>Features</h1>
                    <div class="col-md-6">
                        <div class="card mb-1 featureCards" style={{ height: "400px" }}>
                            <div class="card-body">
                                <img className="w-25 img-fluid mt-4" src={card} alt="" />
                                <h1 class="card-title mt-3">4%</h1>
                                <h2 class="card-title">Auto Liquidity Pool</h2>
                                <p class="card-text p-3 fs-5">4% of every transaction contributes towards automatically generating liquidity that goes into Pancakeswap</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6 mt-md-0 mt-4">
                        <div class="card mb-5 featureCards" style={{ height: "400px" }}>
                            <div class="card-body">
                                <img className="w-25 img-fluid mt-3" src={coins} alt="" />
                                <h1 class="card-title mt-3">4%</h1>
                                <h2 class="card-title">Redistribution in BNB</h2>
                                <p class="card-text p-3 fs-5">4% of every BUY /SELL is taken and redistrbuted to all holders</p>

                            </div>
                        </div>
                    </div>
                </div>
                {/* Feature Ends */}

                {/* Tokenomics Starts */}
                <div className="text-center text-white">
                    <h1 className='mb-4 text-white'>TOKENOMICS</h1>
                    <p className="Tokenomics_bg_1  mt-2  fw-bold fs-6 p-3">Total Supply= 100.000.000 TOKENS</p>
                    <div className="Tokenomics_bg_2 d-flex w-100 justify-content-center justify-content-between align-items-center flex-wrap ">
                        <div className="d-flex flex-column m-3">
                            <p className=" fw-bolder fs-5">100.000.000</p>
                            <p className="fw-bold">Tottal supply</p>
                        </div>
                        <div className="d-flex flex-column m-3">
                            <p className=" fw-bolder fs-5">10.000.000</p>
                            <p className="fw-bold"> Airdrop </p>
                        </div>
                        <div className="d-flex flex-column m-3">
                            <p className=" fw-bolder fs-5">20.000.000</p>
                            <p className="fw-bold">Burn</p>
                        </div>
                        <div className="d-flex flex-column m-3">
                            <p className=" fw-bolder fs-5">40.000.000</p>
                            <p className="fw-bold">Pre sale</p>
                        </div>
                        <div className="d-flex flex-column m-3">
                            <p className=" fw-bolder fs-5"> 20.000.000</p>
                            <p className="fw-bold">liquidity lock</p>
                        </div>
                        <div className="d-flex flex-column m-3">
                            <p className=" fw-bolder fs-5">10.000.000</p>
                            <p className="fw-bold">Team</p>
                        </div>
                    </div>
                    <div className="Tokenomics_bg">
                        <p className=" d-flex mt-5 flex-start fw-bold fs-6  p-2">Raised Fund Allocation</p>
                        <div className="d-flex w-100 justify-content-center justify-content-between align-items-center flex-wrap ">
                            <div className="d-flex flex-column m-3">
                                <p className=" fw-bolder fs-5">80%</p>
                                <p className="fw-bold">Liquidity Lock</p>
                            </div>
                            <div className="d-flex flex-column m-3">
                                <p className=" fw-bolder fs-5">5%</p>
                                <p className="fw-bold"> Development </p>
                            </div>
                            <div className="d-flex flex-column m-3">
                                <p className=" fw-bolder fs-5">10%</p>
                                <p className="fw-bold">Marketing</p>
                            </div>
                            <div className="d-flex flex-column m-3">
                                <p className=" fw-bolder fs-5">5%</p>
                                <p className="fw-bold">CEX Listings</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Tokenomics Ends */}

                {/* Footer Div Starts */}
                <div class="row  Footer_Main text-white mt-5">
                    <h1 className=" text-center mb-5 mt-3 ">Our Main Road Map</h1>
                    <div class="col-md-6">
                        <div class="card  bg-transparent border-0 mb-4" style={{ height: "200px" }}>
                            <div class="card-body">
                                <h5 class="card-title bg-primary w-25 fs-6 rounded-3 p-1">September 2021</h5>
                                <h5 class="card-title">Launch Token</h5>

                                <p class="card-text">Launch (Token contract creation on B.S.C, Airdrop distribution $ Presale)</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="card  bg-transparent border-0 mb-4" style={{ height: "200px" }}>
                            <div class="card-body">
                                <h5 class="card-title bg-primary w-25 fs-6 rounded-3 p-1">November 2021</h5>
                                <h5 class="card-title">Listing on multiple exchanges</h5>

                                <p class="card-text">(RE-Listing BSC TOKEN on CoinGecko, CoinMarketCap & other trust lists, listing on Pancake Swap)</p>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-6">
                        <div class="card  bg-transparent border-0 mb-4" style={{ height: "200px" }}>
                            <div class="card-body">
                                <h5 class="card-title bg-primary w-25 fs-6 rounded-3 p-1">December 2022</h5>
                                <h5 class="card-title">Website Update & Game Launched</h5>

                                <p class="card-text">(Game Launched in beta version).</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="card  bg-transparent border-0 mb-4" style={{ height: "200px" }}>
                            <div class="card-body">
                                <h5 class="card-title bg-primary w-25 fs-6 rounded-3 p-1">January 2022</h5>
                                <h5 class="card-title">App Launched, & Listing in MXC Exchange </h5>

                                <p class="card-text">Providing a variety of games industry services, accessible through a single login: discover, buy, and play games.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="text-center mt-2 text-white fs-6 pb-1">
                    <p>© 2021 Power Ability. All right reserved.</p>
                </div>
                {/* Footer Div Ends */}
            </div>
        </>
    )
}

export default App
