from flask import Flask, jsonify
from telethon.sync import TelegramClient
from telethon.errors import UsernameNotOccupiedError

app = Flask(__name__)

# Your Telegram API credentials
api_id = 25399534
api_hash = "80e7d2e4612b3751d4ab131b18b97f2d"

# Start Telethon session
client = TelegramClient('odowa_session', api_id, api_hash)
client.start()

# List of public Telegram usernames
channel_usernames = [
    "engrodowamain",
    "engrodowatechworld",
    "odowa_market",
    "odowa_social",
    "odowa_qa",
    "engrodowasignal",
    "engrodowaenginsight",
    "engrodfininvestments",
    "engrodairdroptalk",
    "engrodcivilprojects",
    "engrmodfinananalysisgrp",
    "engroddesignerhub",
    "engrodphotoshopexpert"
]

@app.route("/api/groups", methods=["GET"])
def get_group_data():
    group_data = []

    for username in channel_usernames:
        try:
            entity = client.get_entity(username)
            participants = client.get_participants(entity)
            group_data.append({
                "name": entity.title,
                "members": len(participants),
                "link": f"https://t.me/{username}"
            })
        except UsernameNotOccupiedError:
            group_data.append({
                "name": username,
                "members": 0,
                "link": f"https://t.me/{username}",
                "error": True
            })
        except Exception as e:
            group_data.append({
                "name": username,
                "members": 0,
                "link": f"https://t.me/{username}",
                "error": str(e)
            })

    return jsonify(group_data)

if __name__ == "__main__":
    app.run(debug=True)
