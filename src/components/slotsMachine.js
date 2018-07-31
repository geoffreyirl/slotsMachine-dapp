import React from "react";
import axios from "axios";
import { Radio } from "bootstrap";
import "../assets/css/style.css";
import { Panel, Well, Fade, Collapse, Button } from "react-bootstrap";
import nos from "../assets/img/nos.png";
import nex from "../assets/img/nex.png";
import coz from "../assets/img/coz.png";
import lx from "../assets/img/lx.png";
import neon from "../assets/img/neon.png";
import neo from "../assets/img/neo.png";

import $ from "jquery";

export default class Vote extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: ""
    };
  }

  componentDidMount() {
    var nex = [[1, 4, 7, 10, 13, 16, 19], [3, 5, 7, 9, 15, 18, 20], []];
    var nos = [[2], [1, 16], [15]];
    var neo = [[3, 5, 9, 15, 20], [8, 13], [3, 7, 10, 13, 17]];
    var lx = [[6, 12, 18], [2, 6, 10, 12, 14, 19], [1, 5, 8, 12, 14, 18]];
    var neon = [[11, 14, 17], [], [2, 6, 11, 16, 20]];
    var coz = [[8], [4, 11, 17], [4, 9, 19]];
    var cost = 100;
    var sScore = 10000;
    var score = 10000;
    var spinning = false;

    var MersenneTwister = function(seed) {
      if (seed == undefined) {
        seed = new Date().getTime();
      }

      this.N = 624;
      this.M = 397;
      this.MATRIX_A = 0x9908b0df;
      this.UPPER_MASK = 0x80000000;
      this.LOWER_MASK = 0x7fffffff;

      this.mt = new Array(this.N);
      this.mti = this.N + 1;

      this.init_genrand(seed);
    };

    MersenneTwister.prototype.init_genrand = function(s) {
      this.mt[0] = s >>> 0;

      for (this.mti = 1; this.mti < this.N; this.mti++) {
        var s = this.mt[this.mti - 1] ^ (this.mt[this.mti - 1] >>> 30);

        this.mt[this.mti] =
          ((((s & 0xffff0000) >>> 16) * 1812433253) << 16) +
          (s & 0x0000ffff) * 1812433253 +
          this.mti;
        this.mt[this.mti] >>>= 0;
      }
    };

    MersenneTwister.prototype.genrand_int32 = function() {
      var y;
      var mag01 = new Array(0x0, this.MATRIX_A);

      if (this.mti >= this.N) {
        var kk;

        if (this.mti == this.N + 1) this.init_genrand(5489);

        for (kk = 0; kk < this.N - this.M; kk++) {
          y =
            (this.mt[kk] & this.UPPER_MASK) |
            (this.mt[kk + 1] & this.LOWER_MASK);
          this.mt[kk] = this.mt[kk + this.M] ^ (y >>> 1) ^ mag01[y & 0x1];
        }

        for (; kk < this.N - 1; kk++) {
          y =
            (this.mt[kk] & this.UPPER_MASK) |
            (this.mt[kk + 1] & this.LOWER_MASK);
          this.mt[kk] =
            this.mt[kk + (this.M - this.N)] ^ (y >>> 1) ^ mag01[y & 0x1];
        }

        y =
          (this.mt[this.N - 1] & this.UPPER_MASK) |
          (this.mt[0] & this.LOWER_MASK);
        this.mt[this.N - 1] = this.mt[this.M - 1] ^ (y >>> 1) ^ mag01[y & 0x1];

        this.mti = 0;
      }

      y = this.mt[this.mti++];

      y ^= y >>> 11;
      y ^= (y << 7) & 0x9d2c5680;
      y ^= (y << 15) & 0xefc60000;
      y ^= y >>> 18;

      return y >>> 0;
    };

    MersenneTwister.prototype.random = function() {
      return this.genrand_int32() * (1.0 / 4294967296.0);
    };

    function rand(min, max) {
      var s = Math.floor(Math.random() * 100000) * new Date().getTime();
      var m = new MersenneTwister(s);

      return Math.floor(m.random() * (max - min + 1) + min);
    }

    function contains(stack, needle) {
      var i = stack.length;

      while (i--) {
        if (stack[i] === needle) {
          return true;
        }
      }

      return false;
    }

    function checkWin(picked) {
      console.log("checkingwin");
      console.log(picked[0], picked[1], picked[2]);
      // console.log("picking boolean is " + picked[0] === 2);
      /*
    nexs = 1, nos = 2, neo = 3, lx = 4, neon = 5, coz = 6

    Winnings:
    Doubles: nexs = 2, nexs + coz = 4, nexs + neon = 4, lxs + nos = 8, neos + nos = 12, cozs + nos = 16
    Flushes: lxs = 8, neos = 12, cozs = 16, noss = 20
  */

      var winnings = 0;

      if (picked[0] === 1 && picked[1] === 1) {
        // nexs
        if (picked[2] === 5 || picked[2] === 6) {
          // nexs + neon or coz
          winnings += cost * 4;
        } else {
          // nexs + no kicker
          winnings += cost * 2;
        }
      }

      if (picked[0] === 4 && picked[1] === 4) {
        // lxs
        if (picked[2] === 2 || picked[2] === 4) {
          // lxs + nos or flush
          winnings += cost * 8;
        }
      }

      if (picked[0] === 3 && picked[1] === 3) {
        // neos
        if (picked[2] === 3 || picked[2] === 2) {
          // neos + nos or flush
          winnings += cost * 12;
        }
      }

      if (picked[0] === 6 && picked[1] === 6) {
        // cozs
        if (picked[2] === 6 || picked[2] === 2) {
          // cozs + nos or flush
          winnings += cost * 16;
        }
      }

      if (picked[0] === 2 && picked[1] === 2 && picked[3] === 2) {
        // noss flush
        console.log("win");
        winnings += cost * 20;
      }
      console.log("hahah");
      score += winnings;
      $("#winnings-1").text("�" + winnings / 100);
      $("#winnings-2").text("�" + (score / 100 - sScore / 100));

      if (winnings > 0) {
        $("#bank").text("�" + score / 100);
        $("#payouts").text(parseInt($("#payouts").text()) + winnings / 100);

        $("#score-float")
          .text("+�" + winnings / 100)
          .fadeIn()
          .animate({ bottom: "70%" }, 1000, function() {
            $(this).fadeOut(500, function() {
              $(this).css({ bottom: "10%" });
            });
          });
      }
    }

    function spin(n1, n2, n3) {
      var pick1 = rand(0, 19);
      var pick2 = rand(0, 19);
      var pick3 = rand(0, 19);

      if (n1 == 1) {
        pick1 = nex[0][Math.floor(Math.random() * nex[0].length)] - 1;
      } else if (n1 == 2) {
        console.log("here222222222222222");
        pick1 = nos[0][Math.floor(Math.random() * nos[0].length)] - 1;
        console.log(" pick1 " + pick1);
      } else if (n1 == 3) {
        pick1 = neo[0][Math.floor(Math.random() * neo[0].length)] - 1;
      } else if (n1 == 4) {
        pick1 = lx[0][Math.floor(Math.random() * lx[0].length)] - 1;
      } else if (n1 == 5) {
        pick1 = neon[0][Math.floor(Math.random() * neon[0].length)] - 1;
      } else if (n1 == 6) {
        pick1 = coz[0][Math.floor(Math.random() * coz[0].length)] - 1;
      }

      console.log(n2 == 1);
      if (n2 == 1) {
        pick2 = nex[1][Math.floor(Math.random() * nex[1].length)] - 1;
      } else if (n2 == 2) {
        console.log("here2333333333333333333");
        pick2 = nos[1][Math.floor(Math.random() * nos[1].length)] - 1;
        console.log("pick2 " + pick2);
      } else if (n2 == 3) {
        pick2 = neo[1][Math.floor(Math.random() * neo[1].length)] - 1;
      } else if (n2 == 4) {
        pick2 = lx[1][Math.floor(Math.random() * lx[1].length)] - 1;
      } else if (n2 == 5) {
        pick2 = neon[1][Math.floor(Math.random() * neon[1].length)] - 1;
      } else if (n2 == 6) {
        pick2 = coz[1][Math.floor(Math.random() * coz[1].length)] - 1;
      }

      if (n3 == 1) {
        pick3 = nex[2][Math.floor(Math.random() * nex[2].length)] - 1;
      } else if (n3 == 2) {
        console.log("here224444444444444444442");
        pick3 = nos[2][Math.floor(Math.random() * nos[2].length)] - 1;
        console.log("pick 3 " + pick3);
      } else if (n3 == 3) {
        pick3 = neo[2][Math.floor(Math.random() * neo[2].length)] - 1;
      } else if (n3 == 4) {
        pick3 = lx[2][Math.floor(Math.random() * lx[2].length)] - 1;
      } else if (n3 == 5) {
        pick3 = neon[2][Math.floor(Math.random() * neon[2].length)] - 1;
      } else if (n3 == 6) {
        pick3 = coz[2][Math.floor(Math.random() * coz[2].length)] - 1;
      }

      var rand1 = Math.abs(pick1 * 150) * -1;
      var rand2 = Math.abs(pick2 * 150) * -1;
      var rand3 = Math.abs(pick3 * 150) * -1;

      var nost1 = rand(0, 200);
      var nost2 = rand(200, 400);
      var nost3 = rand(400, 600);

      var picked = [];

      if (!spinning && score >= 100) {
        spinning = true;
        score -= cost;
        $("#bank").text("�" + score / 100);

        setTimeout(function() {
          var $main = $("#reel-col-1 .reel-container");
          var $clone = $main
            .clone()
            .prependTo("#reel-col-1")
            .css({ top: $main.position().top - 3000 });

          $main.animate({ top: "+=2850" }, 1000, "linear", function() {
            $("#reel-col-1 .reel-container:nth-child(2)").remove();
          });

          $clone.animate({ top: "+=2850" }, 1000, "linear", function() {
            $clone.animate({ top: rand1 }, 0, "linear");
          });
        }, nost1);

        setTimeout(function() {
          var $main = $("#reel-col-2 .reel-container");
          var $clone = $main
            .clone()
            .prependTo("#reel-col-2")
            .css({ top: $main.position().top - 3000 });

          $main.animate({ top: "+=2850" }, 1000, "linear", function() {
            $("#reel-col-2 .reel-container:nth-child(2)").remove();
          });

          $clone.animate({ top: "+=2850" }, 1000, "linear", function() {
            $clone.animate({ top: rand2 }, 0, "linear");
          });
        }, nost2);

        setTimeout(function() {
          var $main = $("#reel-col-3 .reel-container");
          var $clone = $main
            .clone()
            .prependTo("#reel-col-3")
            .css({ top: $main.position().top - 3000 });

          $main.animate({ top: "+=2850" }, 1000, "linear", function() {
            $("#reel-col-3 .reel-container:nth-child(2)").remove();
          });

          $clone.animate({ top: "+=2850" }, 1000, "linear", function() {
            $clone.animate({ top: rand3 }, 0, "linear");
            spinning = false;
            checkWin(picked);
            // checkWin([2, 2, 2]);
          });
        }, nost3);
        console.log("first number is " + pick1);
        console.log(pick1 >= n1);

        picked.push(n1);
        picked.push(n2);
        picked.push(n3);

        picked.push(n1);
      }
    }

    //$('#score-float').fadeIn();

    $("#spin").on("click", function(e) {
      e.preventDefault();
      spin(2, 2, 2);
    });
  }

  /*     componentWillMount(){
            // need to get the data here
            axios.get('https://jr-001-pawpatrol-course-api.herokuapp.com/api/courses')
                .then((res)=>{
                    console.log(res);
                    this.setState(()=>{
                      return({courses:res.data})
                    });
                })
                .catch((error)=>{throw(error)});
            } */

  render() {
    // let totalYes = 0
    // let totalNo = 0
    // this.state.questionList.forEach((item) => {
    //     item.Status ? totalYes++ : totalNo++
    // })

    return (
      <div className="slot-wrap">
        <div className="container">
          <div className="col-md-12 text-center">
            <h1>slots machine </h1>
          </div>

          <div className="row clearfix">
            <div className="col-md-6">
              <div id="reel-wrap">
                <div id="reel-wrap-win" />
                <div id="reel-col-inner">
                  <div id="reel-col-1" className="reel-col">
                    <div className="reel-container">
                      <div id="frame-1-1" className="slot-frame">
                        <img src={nex} alt={"nex"} />
                      </div>
                      {/* <!-- nex --> */}
                      <div id="frame-1-2" className="slot-frame  ">
                        <img src={nos} alt={"nos"} />
                      </div>
                      {/* <!-- nos --> */}
                      <div id="frame-1-3" className="slot-frame">
                        <img src={neo} alt={"neo"} />
                      </div>
                      {/* <!-- neo --> */}
                      <div id="frame-1-4" className="slot-frame">
                        <img src={nex} alt={"nex"} />
                      </div>
                      {/* <!-- nex --> */}
                      <div id="frame-1-5" className="slot-frame">
                        <img src={neo} alt={"neo"} />
                      </div>
                      {/* <!-- neo --> */}
                      <div id="frame-1-6" className="slot-frame ">
                        <img src={lx} alt={"lx"} />
                      </div>
                      {/* <!-- lx --> */}
                      <div id="frame-1-7" className="slot-frame">
                        <img src={nex} alt={"nex"} />
                      </div>
                      {/* <!-- nex --> */}
                      <div id="frame-1-8" className="slot-frame  ">
                        <img src={coz} alt={"coz"} />
                      </div>
                      {/* <!-- coz --> */}
                      <div id="frame-1-9" className="slot-frame">
                        <img src={neo} alt={"neo"} />
                      </div>
                      {/* <!-- neo --> */}
                      <div id="frame-1-10" className="slot-frame">
                        <img src={nex} alt={"nex"} />
                      </div>
                      {/* <!-- nex --> */}
                      <div id="frame-1-11" className="slot-frame ">
                        <img src={neon} alt={"neon"} />
                      </div>
                      {/* <!-- neon --> */}
                      <div id="frame-1-12" className="slot-frame ">
                        <img src={lx} alt={"lx"} />
                      </div>
                      {/* <!-- lx --> */}
                      <div id="frame-1-13" className="slot-frame">
                        <img src={nex} alt={"nex"} />
                      </div>
                      {/* <!-- nex --> */}
                      <div id="frame-1-14" className="slot-frame ">
                        <img src={neon} alt={"neon"} />
                      </div>
                      {/* <!-- neon --> */}
                      <div id="frame-1-15" className="slot-frame">
                        <img src={neo} alt={"neo"} />
                      </div>
                      {/* <!-- neo --> */}
                      <div id="frame-1-16" className="slot-frame">
                        <img src={nex} alt={"nex"} />
                      </div>
                      {/* <!-- nex --> */}
                      <div id="frame-1-17" className="slot-frame ">
                        <img src={neon} alt={"neon"} />
                      </div>
                      {/* <!-- neon --> */}
                      <div id="frame-1-18" className="slot-frame ">
                        <img src={lx} alt={"lx"} />
                      </div>
                      {/* <!-- lx --> */}
                      <div id="frame-1-19" className="slot-frame">
                        <img src={nex} alt={"nex"} />
                      </div>
                      {/* <!-- nex --> */}
                      <div id="frame-1-20" className="slot-frame">
                        <img src={neo} alt={"neo"} />
                      </div>
                      {/* <!-- neo --> */}
                    </div>
                  </div>
                  <div id="reel-col-2" className="reel-col">
                    <div id="reel-2-0" className="reel-container">
                      <div id="frame-2-1" className="slot-frame  ">
                        <img src={nos} alt={"nos"} />
                      </div>
                      {/* <!-- nos --> */}
                      <div id="frame-2-2" className="slot-frame ">
                        <img src={lx} alt={"lx"} />
                      </div>
                      {/* <!-- lx --> */}
                      <div id="frame-2-3" className="slot-frame">
                        <img src={nex} alt={"nex"} />
                      </div>
                      {/* <!-- nex --> */}
                      <div id="frame-2-4" className="slot-frame  ">
                        <img src={coz} alt={"coz"} />
                      </div>
                      {/* <!-- coz --> */}
                      <div id="frame-2-5" className="slot-frame">
                        <img src={nex} alt={"nex"} />
                      </div>
                      {/* <!-- nex --> */}
                      <div id="frame-2-6" className="slot-frame ">
                        <img src={lx} alt={"lx"} />
                      </div>
                      {/* <!-- lx --> */}
                      <div id="frame-2-7" className="slot-frame">
                        <img src={nex} alt={"nex"} />
                      </div>
                      {/* <!-- nex --> */}
                      <div id="frame-2-8" className="slot-frame">
                        <img src={neo} alt={"neo"} />
                      </div>
                      {/* <!-- neo --> */}
                      <div id="frame-2-9" className="slot-frame">
                        <img src={nex} alt={"nex"} />
                      </div>
                      {/* <!-- nex --> */}
                      <div id="frame-2-10" className="slot-frame ">
                        <img src={lx} alt={"lx"} />
                      </div>
                      {/* <!-- lx --> */}
                      <div id="frame-2-11" className="slot-frame  ">
                        <img src={coz} alt={"coz"} />
                      </div>
                      {/* <!-- coz --> */}
                      <div id="frame-2-12" className="slot-frame ">
                        <img src={lx} alt={"lx"} />
                      </div>
                      {/* <!-- lx --> */}
                      <div id="frame-2-13" className="slot-frame">
                        <img src={neo} alt={"neo"} />
                      </div>
                      {/* <!-- neo --> */}
                      <div id="frame-2-19" className="slot-frame ">
                        <img src={lx} alt={"lx"} />
                      </div>
                      {/* <!-- lx --> */}
                      <div id="frame-2-15" className="slot-frame">
                        <img src={nex} alt={"nex"} />
                      </div>
                      {/* <!-- nex --> */}
                      <div id="frame-2-16" className="slot-frame  ">
                        <img src={nos} alt={"nos"} />
                      </div>
                      {/* <!-- nos --> */}
                      <div id="frame-2-17" className="slot-frame  ">
                        <img src={coz} alt={"coz"} />
                      </div>
                      {/* <!-- coz --> */}
                      <div id="frame-2-18" className="slot-frame">
                        <img src={nex} alt={"nex"} />
                      </div>
                      {/* <!-- nex --> */}
                      <div id="frame-2-19" className="slot-frame ">
                        <img src={lx} alt={"lx"} />
                      </div>
                      {/* <!-- lx --> */}
                      <div id="frame-2-20" className="slot-frame">
                        <img src={nex} alt={"nex"} />
                      </div>
                      {/* <!-- nex --> */}
                    </div>
                  </div>
                  <div id="reel-col-3" className="reel-col">
                    <div id="reel-3-0" className="reel-container">
                      <div id="frame-3-1" className="slot-frame hea">
                        <img src={lx} alt={"lx"} />
                      </div>
                      {/* <!-- lx --> */}
                      <div id="frame-3-2" className="slot-frame ">
                        <img src={neon} alt={"neon"} />
                      </div>
                      {/* <!-- neon --> */}
                      <div id="frame-3-3" className="slot-frame">
                        <img src={neo} alt={"neo"} />
                      </div>
                      {/* <!-- neo --> */}
                      <div id="frame-3-4" className="slot-frame  ">
                        <img src={coz} alt={"coz"} />
                      </div>
                      {/* <!-- coz --> */}
                      <div id="frame-3-5" className="slot-frame ">
                        <img src={lx} alt={"lx"} />
                      </div>
                      {/* <!-- lx --> */}
                      <div id="frame-3-6" className="slot-frame ">
                        <img src={neon} alt={"neon"} />
                      </div>
                      {/* <!-- neon --> */}
                      <div id="frame-3-7" className="slot-frame">
                        <img src={neo} alt={"neo"} />
                      </div>
                      {/* <!-- neo --> */}
                      <div id="frame-3-8" className="slot-frame ">
                        <img src={lx} alt={"lx"} />
                      </div>
                      {/* <!-- lx --> */}
                      <div id="frame-3-9" className="slot-frame  coz">
                        <img src={coz} alt={"coz"} />
                      </div>
                      {/* <!-- coz --> */}
                      <div id="frame-3-10" className="slot-frame">
                        <img src={neo} alt={"neo"} />
                      </div>
                      {/* <!-- neo --> */}
                      <div id="frame-3-5" className="slot-frame lx">
                        <img src={lx} alt={"lx"} />
                      </div>
                      {/* <!-- lx --> */}
                      <div id="frame-3-6" className="slot-frame neo">
                        <img src={lx} alt={"lx"} />
                      </div>
                      {/* <!-- lx --> */}
                      <div id="frame-3-13" className="slot-frame">
                        <img src={neo} alt={"neo"} />
                      </div>
                      {/* <!-- neo --> */}
                      <div id="frame-3-14" className="slot-frame lx">
                        <img src={lx} alt={"lx"} />
                      </div>
                      {/* <!-- lx --> */}
                      <div id="frame-3-15" className="slot-frame  nos">
                        <img src={nos} alt={"nos"} />
                      </div>
                      {/* <!-- nos --> */}
                      <div id="frame-3-16" className="slot-frame  neo">
                        <img src={neon} alt={"neon"} />
                      </div>
                      {/* <!-- neon --> */}
                      <div id="frame-3-17" className="slot-frame">
                        <img src={neo} alt={"neo"} />
                      </div>
                      {/* <!-- neo --> */}
                      <div id="frame-3-18" className="slot-frame  lx">
                        <img src={lx} alt={"lx"} />
                      </div>
                      {/* <!-- lx --> */}
                      <div id="frame-3-19" className="slot-frame   coz">
                        <img src={coz} alt={"coz"} />
                      </div>
                      {/* <!-- coz --> */}
                      <div id="frame-3-20" className="slot-frame  neo">
                        <img src={neon} alt={"neon"} />
                      </div>
                      {/* <!-- neon --> */}
                    </div>
                  </div>
                </div>
              </div>
              <span id="score-float" style={{ bottom: "10%" }}>
                +&sect;100
              </span>

              <div className="row clearfix" style={{ "text-align": "center" }}>
                <button id="spin">Spin!</button>
              </div>
              <div className="row clearfix" style={{ "margin-top": "5px" }}>
                <table id="stats" style={{ margin: "0 auto", width: "520px" }}>
                  <tr>
                    <td className="heading">Bankroll:</td>
                    <td id="bank" />
                  </tr>
                  <tr>
                    <td className="heading">Winnings (round):</td>
                    <td id="winnings-1">&sect;0</td>
                  </tr>
                  <tr>
                    <td className="heading">Total Payouts:</td>
                    <td>
                      &sect;<span id="payouts">0</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="heading">Winnings (session):</td>
                    <td id="winnings-2">&sect;0</td>
                  </tr>
                </table>
              </div>
            </div>
            <div className="col-md-6">
              <table
                id="payout"
                style={{
                  margin: "100px auto 0 auto",
                  "text-align": "center",
                  width: "340px"
                }}
              >
                <tr>
                  <td colspan="4" className="no-border">
                    <h2>Win Chart </h2>
                  </td>
                </tr>
                <tr>
                  <td style={{ border: "none" }} />
                  <td style={{ border: "none" }} />
                  <td style={{ border: "none" }} />
                  <td>&sect;1</td>
                </tr>
                <tr>
                  <td className="slots_img">
                    <img src={nos} alt={"nos"} />
                  </td>
                  <td className="slots_img">
                    {" "}
                    <img src={nos} alt={"nos"} />
                  </td>
                  <td className="slots_img">
                    <img src={nos} alt={"nos"} />
                  </td>
                  <td>&sect;20</td>
                </tr>
                <tr>
                  <td className="slots_img">
                    <img src={coz} alt={"coz"} />
                  </td>
                  <td className="slots_img">
                    {" "}
                    <img src={coz} alt={"coz"} />
                  </td>
                  <td className="slots_img">
                    <img src={coz} alt={"coz"} />
                  </td>
                  <td>&sect;16</td>
                </tr>
                <tr>
                  <td className="slots_img">
                    <img src={coz} alt={"coz"} />
                  </td>
                  <td className="slots_img">
                    {" "}
                    <img src={coz} alt={"coz"} />
                  </td>
                  <td className="slots_img">
                    <img src={nos} alt={"nos"} />
                  </td>
                  <td>&sect;16</td>
                </tr>
                <tr>
                  <td className="slots_img">
                    <img src={neo} alt={"neo"} />
                  </td>
                  <td className="slots_img">
                    {" "}
                    <img src={neo} alt={"neo"} />
                  </td>
                  <td className="slots_img">
                    <img src={neo} alt={"neo"} />
                  </td>
                  <td>&sect;12</td>
                </tr>
                <tr>
                  <td className="slots_img">
                    <img src={neo} alt={"neo"} />
                  </td>
                  <td className="slots_img">
                    {" "}
                    <img src={neo} alt={"neo"} />
                  </td>
                  <td className="slots_img">
                    <img src={nos} alt={"nos"} />
                  </td>
                  <td>&sect;12</td>
                </tr>
                <tr>
                  <td className="slots_img">
                    <img src={lx} alt={"lx"} />
                  </td>
                  <td className="slots_img">
                    {" "}
                    <img src={lx} alt={"lx"} />
                  </td>
                  <td className="slots_img">
                    <img src={lx} alt={"lx"} />
                  </td>
                  <td>&sect;8</td>
                </tr>
                <tr>
                  <td className="slots_img">
                    <img src={lx} alt={"lx"} />
                  </td>
                  <td className="slots_img">
                    {" "}
                    <img src={lx} alt={"lx"} />
                  </td>
                  <td className="slots_img">
                    <img src={nos} alt={"nos"} />
                  </td>
                  <td>&sect;8</td>
                </tr>
                <tr>
                  <td className="slots_img">
                    <img src={nex} alt={"nex"} />
                  </td>
                  <td className="slots_img">
                    {" "}
                    <img src={nex} alt={"nex"} />
                  </td>
                  <td className="slots_img">
                    <img src={coz} alt={"coz"} />
                  </td>
                  <td>&sect;4</td>
                </tr>
                <tr>
                  <td className="slots_img">
                    <img src={nex} alt={"nex"} />
                  </td>
                  <td className="slots_img">
                    {" "}
                    <img src={nex} alt={"nex"} />
                  </td>
                  <td className="slots_img">
                    <img src={neon} alt={"neon"} />
                  </td>
                  <td>&sect;4</td>
                </tr>
                <tr>
                  <td className="slots_img">
                    <img src={nex} alt={"nex"} />
                  </td>
                  <td className="slots_img">
                    {" "}
                    <img src={nex} alt={"nex"} />
                  </td>
                  <td>ANY</td>
                  <td>&sect;2</td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
