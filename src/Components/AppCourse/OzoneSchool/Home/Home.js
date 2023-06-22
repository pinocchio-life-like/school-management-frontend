import React, { useEffect } from "react";
import "./Home.css";
import { RightOutlined, MinusOutlined, CheckOutlined } from "@ant-design/icons";
import introImage from "../../../../Resources/boy-310099_1920.png";
import { Button, Col, Row } from "antd";
import maleStudent from "../../../../Resources/male-student-studying-svgrepo-com.svg";
import femaleStudent from "../../../../Resources/fall-of-study-female-student-svgrepo-com.svg";
import sunSvg from "../../../../Resources/sun-svgrepo-com (1).svg";
import suitcaseSvg from "../../../../Resources/suitcase-svgrepo-com.svg";
import speakerSvg from "../../../../Resources/speaker-svgrepo-com.svg";
import CardContainer from "./CardContainer/CardContainer";
import healthyKid from "../../../../Resources/omaha-healthy-kids-alliance-38.png";
import AmotherAndKId from "../../../../Resources/smiley-mother-holding-kid-side-view_2.png";
import ClosingBetter from "../../../../Resources/Home-Page-Banner.png";
import ExpandableDiv from "./ExpandableDiv/ExpandableDiv";
import Career from "../Career/Career";
const Home = (props) => {
  useEffect(() => {
    if (props.routed !== "home" && props.routed !== "contact") {
      const element = document.getElementById(props.routed);
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, [props.routed]);

  return (
    <div className="LandingPageHomeClass">
      <div className="IntroductionTextHolder">
        <div
          style={{ display: "flex", flexDirection: "column", marginTop: 100 }}>
          <h1 className="IntroTextHeader">
            We Make
            <br />
            Hero of Your <span style={{ color: "#FF6E31" }}>Kids</span>
          </h1>
          <h2 className="IntroTextSecondHeader">
            We communicate Education in a way that creates
            <br />
            Enthusiasm, Creativity and Awareness .{" "}
            {/* <span style={{ color: "rgb(251, 255, 14)" }}> */}
            {/* Our School wants
            <br /> to create a visual that would reflect kids personality, would{" "}
            <br />
            resonate with parents and children */}
            {/* </span> */}. .
          </h2>
        </div>
        <div style={{ marginTop: 40 }}>
          <img className="IntroImageClass" src={introImage} alt="" />
        </div>
      </div>
      <div className="BetterFuture">
        <h1>Better Future For Your Kids</h1>
        <p className="BetterFutureP">
          Let the child be the director, and the actor in his own play
        </p>
        <div className="GetStartedFuture">
          <div className="maleStudentClass">
            <img
              className="MaleStudentIllustrationClass"
              src={maleStudent}
              alt=""
            />
          </div>
          <div className="GetStartedExplanation">
            <Button className="GetStartedButton" type="Ghost">
              Get Started <RightOutlined />
            </Button>
            <p className="GetStartedP">
              <MinusOutlined style={{ color: "salmon" }} /> We dont just give
              our students only lecture
              <br /> but real life experiment, workshops and filled
              <br /> experiance throughout the journey!
            </p>
            <div className="StudentsCountOnGet">
              <div className="StudentCounterOnGet">900+</div>
              <div className="StudentsCountExplain">
                Total students enrolled <br />
                at our school
              </div>
            </div>
            <div className="TeachersCountOnGet">
              <div className="TeachersCounterOnGet">50+</div>
              <div className="TeachersCountExplain">
                Committed Teachers and <br />
                staff members
              </div>
            </div>
          </div>
          <div className="FemaleStudentClass">
            <img
              className="FemaleStudentIllustrationClass"
              src={femaleStudent}
              alt=""
            />
          </div>
        </div>
      </div>
      <div className="HomeProgramsContainer">
        <div className="HomeProgramsDescriptionTitle">
          <h2>Programs</h2>
          <h5>
            Our programs are designed to
            <br />
            develop your Children
          </h5>
        </div>
        <div className="HomeProgramsDescription">
          <img
            style={{ marginTop: "25px", width: 80, height: 80 }}
            src={sunSvg}
            alt=""
          />
          <h2>Creative Thinking</h2>
          <h5 style={{ width: "300px" }}>
            At our school, we cultivate a culture of creative thinking,
            inspiring students to explore new ideas, embrace innovative
            approaches, and think outside the box. We provide an environment
            that encourages curiosity, originality, and imaginative
            problem-solving, nurturing the next generation of innovative
            thinkers and visionaries.
          </h5>
        </div>
        <div className="HomeProgramsDescription">
          <img
            style={{ marginTop: "25px", width: 80, height: 80 }}
            src={suitcaseSvg}
            alt=""
          />
          <h2>Career Planning</h2>
          <h5 style={{ width: "300px" }}>
            We offer comprehensive career guidance and support, helping students
            explore various industries, identify their strengths and interests,
            and make informed decisions about their educational and career
            pathways. Our goal is to empower students to envision and pursue
            fulfilling careers that align with their aspirations and talents.
          </h5>
        </div>
        <div className="HomeProgramsDescription">
          <img
            style={{ marginTop: "25px", width: 80, height: 80 }}
            src={speakerSvg}
            alt=""
          />
          <h2>Public Speaking</h2>
          <h5 style={{ width: "300px" }}>
            We prioritize the development of strong public speaking skills. We
            provide opportunities for students to practice and refine their
            communication abilities, building confidence and eloquence as they
            learn to express their ideas effectively in front of an audience.
          </h5>
        </div>
      </div>
      <div className="HomePageResources">
        <h1>Our Resources</h1>
        <h4>We develop their Confidence to make them sharper</h4>
        <CardContainer />
      </div>
      <div className="TeachingMethod">
        <div className="TeachingMethodList">
          <h2>
            In-person classroom <br />
            That encourages <br />
            students to
          </h2>
          <p>
            <CheckOutlined className="ListCheckOutLined" /> Focus for long
            periods of time
          </p>
          <p>
            <CheckOutlined className="ListCheckOutLined" /> Engage with their
            peers
          </p>
          <p>
            <CheckOutlined className="ListCheckOutLined" /> Understanding of
            complicated concepts
          </p>
        </div>
        <div className="HealthyKidDiv">
          <img
            style={{ width: 320, marginBottom: 150 }}
            src={healthyKid}
            alt=""
          />
        </div>
      </div>
      <div className="AMotherAndAKid">
        <div className="AMotherAndAKidPic">
          <img
            style={{
              width: 450,
              height: 400,
              marginTop: -120,
            }}
            src={AmotherAndKId}
            alt=""
          />
        </div>
        <div className="AMotherAndAKidDesc">
          <h2>
            Children will be
            <br /> tested with quiz <br />
            games
          </h2>
          <p>
            Children will be tested with their knowledge
            <br />
            skills via trivia games for kids activities like
            <br />
            never before
          </p>
        </div>
      </div>
      <div
        id="about"
        style={{
          fontWeight: 600,
          color: "rgba(40, 21, 136, 0.8)",
          alignSelf: "center",
          paddingTop: 100,
          paddingBottom: 40,
          marginTop: 40,
        }}>
        <h2 style={{ margin: 0, fontSize: 36 }}>About Ozone School</h2>
      </div>
      <div className="ExpandabelDivClass" style={{ background: "#070A52" }}>
        <ExpandableDiv index={1} />
      </div>
      <div id="testimonials"></div>
      <div className="TestimonialsHeader">
        <h2>
          Some of Our
          <br />
          Testimonials
        </h2>
        <hr style={{ width: "70%", border: "1px solid blue" }} />
        <Button className="SeeAllButton">
          See All
          <RightOutlined />
        </Button>
      </div>
      <div className="TestimonialsContainer">
        <Row
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 20,
          }}>
          <Col className="TestimonialsCard">
            <div className="TestimoniaslCardName">Abebe Zeleke</div>
            <div className="TestimoniaslCardDescription">
              We are extremely grateful for the education our child received at
              Ozone School. The dedicated faculty and their personalized
              approach to teaching have made a significant impact on our child's
              academic growth. The school's emphasis on practical learning and
              real-world applications has equipped our child with valuable
              skills that will undoubtedly benefit them in their future
              endeavors. We wholeheartedly recommend Ozone School to any parent
              seeking a nurturing and academically enriching environment for
              their child.
            </div>
            <div className="TestimoniaslCardDate">Date: 12-8-2022</div>
          </Col>
          <Col className="TestimonialsCard">
            <div className="TestimoniaslCardName">Shimellis Abshiru</div>
            <div className="TestimoniaslCardDescription">
              Our experience with Ozone School has been nothing short of
              exceptional. The warm and inclusive community at the school has
              made our child feel welcomed and supported. The wide range of
              extracurricular activities and clubs offered by the school has
              allowed our child to explore their interests and develop a
              well-rounded personality. We are grateful to Ozone School for not
              only shaping our child's education but also for instilling strong
              values and fostering a sense of belonging.
            </div>
            <div className="TestimoniaslCardDate">Date: 12-8-2022</div>
          </Col>
          <Col className="TestimonialsCard">
            <div className="TestimoniaslCardName">Aminu Abdella</div>
            <div className="TestimoniaslCardDescription">
              The commitment of Ozone School to embrace innovation and
              technology in education is truly impressive. The school's modern
              facilities and resources have provided our child with a
              stimulating learning environment. We are delighted that Ozone
              School continually strives to stay at the forefront of educational
              advancements, ensuring that our child is well-prepared for the
              ever-evolving world. Choosing Ozone School has been an excellent
              decision for our child's educational journey
            </div>
            <div className="TestimoniaslCardDate">Date: 12-8-2022</div>
          </Col>
          <Col className="TestimonialsCard">
            <div className="TestimoniaslCardName">Zelalem Sisay</div>
            <div className="TestimoniaslCardDescription">
              As parents, we couldn't be happier with the education our child
              has received at Ozone School. The faculty's dedication to
              nurturing individual talents and fostering a love for learning has
              been outstanding. The regular communication between teachers and
              parents has allowed us to actively participate in our child's
              education, making us feel like valued partners. Ozone School's
              holistic approach to education has nurtured our child's academic,
              social, and emotional growth.
            </div>
            <div className="TestimoniaslCardDate">Date: 12-8-2022</div>
          </Col>
        </Row>
      </div>
      <div
        id="career"
        style={{
          fontWeight: 600,
          color: "rgba(40, 21, 136, 0.8)",
          alignSelf: "center",
          paddingTop: 100,
          paddingBottom: 40,
        }}>
        <h2 style={{ margin: 0, fontSize: 36 }}>We're Hiring</h2>
      </div>
      <div>
        <Career />
      </div>
      <div className="BetterFutureCLosing">
        <div
          style={{
            width: "50%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingTop: 60,
          }}>
          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "#070A52",
            }}>
            Better Future for <br /> Your Kids
          </div>
          <div
            style={{
              marginTop: 20,
              fontWeight: 800,
              color: "#070A52",
            }}>
            Get our Free E-book
          </div>
          <Button type="Ghost" className="GetStartedButtonEnd">
            Get Started
            <RightOutlined />
          </Button>
        </div>
        <div
          style={{
            background: "#FF6E31",
            width: "50%",
            borderRadius: 8,
            height: "280px",
          }}>
          <img
            style={{
              width: "100%",
              height: "600px",
              marginTop: -190,
            }}
            src={ClosingBetter}
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
