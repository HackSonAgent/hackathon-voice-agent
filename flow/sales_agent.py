import boto3    
import uuid
import sys
import json

# --- Configuration ---
# Replace with your specific details
AWS_REGION = "us-west-2"  # e.g., 'us-east-1', 'us-west-2', etc.
AGENT_ID = "H4I1KUGNCW"  # Replace with your Agent's ID
AGENT_ALIAS_ID = "XJ83BFUVST" # Replace with your Agent's Alias ID (often TSTALIASID for draft)
# --- End Configuration ---

# Initialize the Bedrock Agent Runtime client
try:
    bedrock_agent_runtime_client = boto3.client(
        'bedrock-agent-runtime',
        region_name=AWS_REGION
    )
except Exception as e:
    print(f"Error initializing Bedrock Agent Runtime client: {e}")
    sys.exit(1)

# Generate a unique session ID for the conversation
session_id = str(uuid.uuid4())

def invoke_rag_flow(prompt: str, current_session_id: str):
    """
    Invokes the Bedrock Agent (RAG flow) with the given prompt.

    Args:
        prompt: The user's input/question for the RAG flow.
        current_session_id: The unique ID for the current session.

    Returns:
        The generated response text from the agent, or None if an error occurs.
    """
    try:
        print(f"\nInvoking Agent (Session: {current_session_id})...")
        # Invoke the agent
        response = bedrock_agent_runtime_client.invoke_flow(
            flowIdentifier=AGENT_ID,
            flowAliasIdentifier=AGENT_ALIAS_ID,
            inputs=[
                {
                    'content': {
                        'document': prompt
                    },
                    "nodeName": "FlowInputNode",
                    "nodeOutputName": "document"
                },
            ],
            enableTrace=False # Set to True to get detailed trace information (optional)
        )

        # Handle the streaming response
        completion = ""
        response_stream = response.get('responseStream')

        if not response_stream:
            print("Error: No completion stream found in the response.")
            return None

        print("Agent Response:")
        for event in response_stream:
            if 'chunk' in event:
                data = event['chunk']['bytes']
                chunk_text = data.decode('utf-8')
                print(chunk_text, end="") # Print chunks as they arrive
                completion += chunk_text
            elif 'trace' in event:
                 # You can process trace information here if enableTrace=True
                 # print(json.dumps(event['trace'], indent=2))
                 pass
            elif 'attribution' in event:
                 # You can process citation/attribution information here if available
                 # print("\n\n-----Attribution-----")
                 # print(json.dumps(event['attribution'], indent=2))
                 pass
            else:
                print(f"\nWarning: Received unknown event type: {event}")


        print("\n--- End of Agent Response ---")
        return completion # Return the full concatenated response

    except boto3.exceptions.Boto3Error as e:
        print(f"AWS API Error: {e}")
        return None
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return None

# --- Main Execution ---
if __name__ == "__main__":
    if AGENT_ID == "YOUR_AGENT_ID" or AGENT_ALIAS_ID == "YOUR_AGENT_ALIAS_ID":
         print("ERROR: Please update the AGENT_ID and AGENT_ALIAS_ID variables in the script.")
         sys.exit(1)

    print(f"Using Agent ID: {AGENT_ID}")
    print(f"Using Agent Alias ID: {AGENT_ALIAS_ID}")
    print(f"Using Session ID: {session_id}")
    print("Enter your questions for the RAG flow (type 'quit' to exit):")

    while True:
        try:
            user_input = input("\nYour question: ")
            if user_input.lower() == 'quit':
                print("Exiting.")
                break

            if not user_input:
                continue

            # Invoke the RAG flow (Agent)
            response_text = invoke_rag_flow(user_input, session_id)

            if response_text is None:
                print("Failed to get a response from the agent.")

            # Optional: You could add logic here to decide if you want to end the
            # session based on the conversation flow. For simplicity, this example
            # uses the same session ID for the entire run.
            # To end a session, you'd call invoke_agent one last time with endSession=True

        except KeyboardInterrupt:
            print("\nExiting.")
            break