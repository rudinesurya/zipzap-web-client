import { useDispatch, useSelector } from "react-redux";
import { Button, Form, Message, Segment, TextArea } from "semantic-ui-react";
import { RootState } from "../redux/store";
import { useState } from "react";
import { useParams } from "react-router-dom";

interface RouteParams extends Record<string, string> {
    jobId: string;
}

const ApplyJob: React.FC = () => {
    const { jobId } = useParams<RouteParams>();
    const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.users);
    const [coverLetter, setCoverLetter] = useState("");
    const [error, setError] = useState(false);

    const handleSubmit = () => {
        if (!coverLetter.trim()) {
            setError(true);
            return;
        }
        setError(false);

        const applicationData = {
            jobId,
            userId: user?._id, // Ensure `user` exists
            coverLetter,
        };

        console.log(JSON.stringify(applicationData));

        // dispatch(applyForJobRequest(applicationData)); // Dispatch Redux action
    };

    return (
        <Segment>
            <Form error={error}>
                <Form.Field>
                    <label>Cover Letter</label>
                    <TextArea
                        placeholder="Write a short cover letter..."
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                    />
                </Form.Field>

                {error && (
                    <Message
                        error
                        header="Error"
                        content="Cover letter cannot be empty!"
                    />
                )}

                <Button primary onClick={handleSubmit}>
                    Submit Application
                </Button>
            </Form>
        </Segment>
    );
};

export default ApplyJob;