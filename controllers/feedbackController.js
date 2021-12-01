import Feedback from "../models/FeedbackModel.js";
import generateEmail from "../services/generate_email.js";

const createFeedback = async (req, res) => {
  console.log("recoverPassword");
  const { firstName, lastName, email, reasonforcontacting, message } = req.body;
  const html = `<p>${firstName} ${lastName} from mail: ${email} sent you the following message.
  \n\n ${message}      
        </p>`;
  await generateEmail("info@yahkiawakened.com", "Yakhi - Contact Us", html);
  return res.status(201).json({
    message: "Message sent successfully to Yakhi",
  });
};

export { createFeedback };
