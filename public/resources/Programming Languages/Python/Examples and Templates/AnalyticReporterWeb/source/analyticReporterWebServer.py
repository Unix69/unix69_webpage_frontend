import json
import os
import sys
from functools import wraps
import colorlog
from flask import Flask, request, send_file, render_template, redirect, url_for, session
from flask_cors import CORS
from datetime import datetime
from mongo.mongolib import MongoReporter, ProducedEmptyReportException
import logging
from logging.handlers import RotatingFileHandler
from logging import StreamHandler

analyticReporterWebServerConfigurationFile = "./AnalyticReporterWebServer.conf"
analyticReporterWebServerName = ""
analyticReporterWebServerMaximumNumberOfLogFiles = 0
analyticReporterWebServerMaximumLogFileSizeInMB = 0
analyticReporterWebServerMinimumLogLevel = ""
analyticReporterWebServerLogDirectory = ""
analyticReporterWebServerLogFilename = ""
analyticReporterWebServerInDebugMode = True
analyticReporterWebServerPassword = ""
analyticReporterWebServerIP = ""
analyticReporterWebServerPort = 0
analyticReporterWebServerSessionLifetimeSeconds = 0
analyticReporterWebServerReportableApplications = []
mongoServerSelectionTimeoutMS = 0
mongoServerIP = ""
mongoServerPort = 0
mongoDatabaseName = ""
mongoCollectionName = ""

analyticReporterWebServer = Flask(__name__)
CORS(analyticReporterWebServer)


def authenticate(username: str = "", password: str = ""):
    global analyticReporterWebServerPassword
    if analyticReporterWebServerPassword == password:
        return True
    return False

def auth_required(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        if not session.get("authenticated"):
            return redirect(url_for('login'))
        return func(*args, **kwargs)
    return wrapper

def configure_web_server_logger():
    global analyticReporterWebServer
    global analyticReporterWebServerLogDirectory
    global analyticReporterWebServerLogFilename
    global analyticReporterWebServerMinimumLogLevel
    global analyticReporterWebServerMaximumNumberOfLogFiles
    global analyticReporterWebServerMaximumLogFileSizeInMB

    try:

        # Remove all default logging handlers from Flask analyticReporterWebServer
        for handler in analyticReporterWebServer.logger.handlers[:]:
            analyticReporterWebServer.logger.removeHandler(handler)

        min_log_level = 0
        if analyticReporterWebServerMinimumLogLevel == "DEBUG":
            min_log_level = logging.DEBUG
        elif analyticReporterWebServerMinimumLogLevel == "INFO":
            min_log_level = logging.INFO
        elif analyticReporterWebServerMinimumLogLevel == "WARNING":
            min_log_level = logging.WARNING
        elif analyticReporterWebServerMinimumLogLevel == "ERROR":
            min_log_level = logging.ERROR
        elif analyticReporterWebServerMinimumLogLevel == "CRITICAL":
            min_log_level = logging.CRITICAL
        else:
            min_log_level = logging.WARNING

        analyticReporterWebServer.logger.setLevel(level=min_log_level)

        # File logger configuration
        file_formatter = logging.Formatter("DateTime-%(asctime)s|Proc-%(processName)s|Thread-%(threadName)s|Mod-%(module)s|Func-%(funcName)s|File-%(pathname)s|Line-%(lineno)d|Logger-%(name)s|Level-%(levelname)s: %(message)s")
        os.makedirs(analyticReporterWebServerLogDirectory, exist_ok=True)
        rotFileLogHandler = RotatingFileHandler(filename=os.path.join(analyticReporterWebServerLogDirectory, analyticReporterWebServerLogFilename),
                                                maxBytes=1024*1024*analyticReporterWebServerMaximumLogFileSizeInMB,
                                                backupCount=analyticReporterWebServerMaximumNumberOfLogFiles, delay=True)
        rotFileLogHandler.setFormatter(file_formatter)
        rotFileLogHandler.setLevel(analyticReporterWebServerMinimumLogLevel)
        analyticReporterWebServer.logger.addHandler(rotFileLogHandler)

        # Stream logger configuration
        stream_formatter = colorlog.ColoredFormatter(
            "%(log_color)s%(asctime)s|%(processName)s|%(threadName)s|%(module)s|%(funcName)s|%(levelname)s: %(message)s",
            log_colors={
                "DEBUG": "cyan",
                "INFO": "green",
                "WARNING": "yellow",
                "ERROR": "red",
                "CRITICAL": "red,bg_white",
            }
        )

        streamLogHandler = StreamHandler(stream=sys.stdout)
        streamLogHandler.setFormatter(stream_formatter)
        streamLogHandler.setLevel(analyticReporterWebServerMinimumLogLevel)
        analyticReporterWebServer.logger.addHandler(streamLogHandler)

        # Sys logger configuration only if host is a UNIX System
        if sys.platform == "linux" or sys.platform == "darwin":
            from logging.handlers import SysLogHandler
            sysLogHandler = SysLogHandler(address="/dev/log")
            sysLogHandler.setFormatter(file_formatter)
            sysLogHandler.setLevel(level=analyticReporterWebServerMinimumLogLevel)
            analyticReporterWebServer.logger.addHandler(sysLogHandler)
    except Exception as e:
        print("Unable to configure logger with Exception: " + str(e))
        raise e



def get_web_server_configuration(configurationFile: str):
    global analyticReporterWebServer
    global analyticReporterWebServerName
    global analyticReporterWebServerIP
    global analyticReporterWebServerPort
    global analyticReporterWebServerLogDirectory
    global analyticReporterWebServerLogFilename
    global analyticReporterWebServerMinimumLogLevel
    global analyticReporterWebServerMaximumNumberOfLogFiles
    global analyticReporterWebServerMaximumLogFileSizeInMB
    global analyticReporterWebServerInDebugMode
    global analyticReporterWebServerPassword
    global analyticReporterWebServerSessionLifetimeSeconds
    global analyticReporterWebServerReportableApplications
    global mongoServerSelectionTimeoutMS
    global mongoServerIP
    global mongoServerPort
    global mongoDatabaseName
    global mongoCollectionName


    try:
        print("Get configuration from file " + configurationFile)
        with open(configurationFile) as configurationFile:
            configuration = json.load(configurationFile)
            analyticReporterWebServerIP = configuration["analyticReporterWebServerIP"]
            analyticReporterWebServerName = configuration["analyticReporterWebServerName"]
            analyticReporterWebServerPort = int(configuration["analyticReporterWebServerPort"])
            analyticReporterWebServerMaximumLogFileSizeInMB = int(configuration["analyticReporterWebServerMaximumLogFileSizeInMB"])
            analyticReporterWebServerMaximumNumberOfLogFiles = int(configuration["analyticReporterWebServerMaximumNumberOfLogFiles"])
            analyticReporterWebServerLogFilename = configuration["analyticReporterWebServerLogFilename"]
            analyticReporterWebServerLogDirectory = configuration["analyticReporterWebServerLogDirectory"]
            analyticReporterWebServerMinimumLogLevel = configuration["analyticReporterWebServerMinimumLogLevel"]
            analyticReporterWebServerInDebugMode = configuration["analyticReporterWebServerInDebugMode"]
            analyticReporterWebServerPassword = configuration["analyticReporterWebServerPassword"]
            analyticReporterWebServerSessionLifetimeSeconds = int(configuration["analyticReporterWebServerSessionLifetimeSeconds"])
            analyticReporterWebServerReportableApplications = configuration["analyticReporterWebServerReportableApplications"]
            mongoServerSelectionTimeoutMS = int(configuration["mongoServerSelectionTimeoutMS"])
            mongoServerIP = configuration["mongoServerIP"]
            mongoServerPort = int(configuration["mongoServerPort"])
            mongoDatabaseName = configuration["mongoDatabaseName"]
            mongoCollectionName = configuration["mongoCollectionName"]
        return str(configuration)
    except Exception as e:
        print("Unable to get configuration from file " + configurationFile + " with Exception: " + str(e))
        raise e

@analyticReporterWebServer.route("/")
def index():
    analyticReporterWebServer.logger.info("Received " + str(request.method) + " request on host " + str(request.host))
    analyticReporterWebServer.logger.info("Request from remote address " + str(request.remote_addr) + " remote user " + str(request.remote_user))
    analyticReporterWebServer.logger.info("Requested url " + str(request.url))
    return redirect(url_for("login"))

@analyticReporterWebServer.route("/login", methods=["POST", "GET"])
def login():
    global analyticReporterWebServer
    analyticReporterWebServer.logger.info("Received " + str(request.method) + " request on host " + str(request.host))
    analyticReporterWebServer.logger.info(
        "Request from remote address " + str(request.remote_addr) + " remote user " + str(request.remote_user))
    analyticReporterWebServer.logger.info("Requested url " + str(request.url))
    if request.method == "POST":
        password = str(request.form["password"])
        username = str(request.form["username"])
        if authenticate(username=username, password=password):
            session["authenticated"] = True
            session["username"] = username
            session.permanent = True
            return redirect(url_for("generate_report"))
        else:
            analyticReporterWebServer.logger.info("Wrong Authentication, password " + password + " username " + username)
            return render_template("login.html", errorMessage="Wrong Authentication"), 401
    else:
        return render_template("login.html"), 200

@analyticReporterWebServer.route("/generate_report", methods=["POST", "GET"])
@auth_required
def generate_report():
    global analyticReporterWebServerApplicationForReport
    global analyticReporterWebServer
    global mongoServerSelectionTimeoutMS
    global mongoServerIP
    global mongoServerPort
    global mongoDatabaseName
    global mongoCollectionName

    report_file_path = ""

    analyticReporterWebServer.logger.info("Received " + str(request.method) + " request on host " + str(request.host))
    analyticReporterWebServer.logger.info(
        "Request from remote address " + str(request.remote_addr) + " remote user " + str(request.remote_user))
    analyticReporterWebServer.logger.info("Url " + str(request.url))

    if request.method == "POST":
        try:

            # Get Form parameters
            fromReportDate = datetime.strptime(str(request.form["reportFromDate"]), "%Y-%m-%d")
            toReportDate = datetime.strptime(str(request.form["reportToDate"]), "%Y-%m-%d")
            application = str(request.form["application"])

            # Validate Form parameters
            if fromReportDate >= toReportDate:
                analyticReporterWebServer.logger.info("Invalid dates")
                return render_template("generate_report.html", applications=analyticReporterWebServerReportableApplications, errorMessage="Unprocessable Entity"), 422
            if application not in analyticReporterWebServerReportableApplications:
                analyticReporterWebServer.logger.info("Invalid application")
                return render_template("generate_report.html", applications=analyticReporterWebServerReportableApplications, errorMessage="Unprocessable Entity"), 422

            analyticReporterWebServer.logger.info(
                "Generate report for application " + application + " from date " + str(
                    fromReportDate) + " to date " + str(toReportDate))

            mongo_reporter = MongoReporter(mongo_server_ip=mongoServerIP,
                                           mongo_server_port=mongoServerPort,
                                           mongo_database_name=mongoDatabaseName,
                                           mongo_collection_name=mongoCollectionName,
                                           mongo_server_selection_timeout_ms=mongoServerSelectionTimeoutMS,
                                           logger=analyticReporterWebServer.logger)

            if application == "Predicts-v0":
                report_file_path = mongo_reporter.make_report_predicts_v0(fromReportDate=fromReportDate, toReportDate=toReportDate)
            elif application == "Predicts-v1":
                report_file_path = mongo_reporter.make_report_predicts(fromReportDate=fromReportDate, toReportDate=toReportDate)

            mongo_reporter.close()

            analyticReporterWebServer.logger.info("Send report file " + report_file_path)
            return send_file(
                report_file_path,
                as_attachment=True,
                download_name="report.xlsx",
                mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            ), 200
        except ProducedEmptyReportException as e:
            analyticReporterWebServer.logger.warning("Produced empty report with Exception: " + str(e))
            return render_template("generate_report.html", applications=analyticReporterWebServerReportableApplications, errorMessage="No Content"), 204
        except Exception as e:
            analyticReporterWebServer.logger.error("Internal Server Error with Exception: " + str(e))
            return render_template("generate_report.html", applications=analyticReporterWebServerReportableApplications, errorMessage="Internal Server Error"), 500
    else:
        return render_template("generate_report.html", applications=analyticReporterWebServerReportableApplications), 200

def main():
    global analyticReporterWebServer
    global analyticReporterWebServerConfigurationFile
    global analyticReporterWebServerIP
    global analyticReporterWebServerPort
    global analyticReporterWebServerName
    global analyticReporterWebServerInDebugMode
    global analyticReporterWebServerSessionLifetimeSeconds

    analyticReporterWebServerConfiguration = get_web_server_configuration(configurationFile=analyticReporterWebServerConfigurationFile)
    analyticReporterWebServer.config['PERMANENT_SESSION_LIFETIME'] = analyticReporterWebServerSessionLifetimeSeconds
    analyticReporterWebServer.secret_key = os.urandom(24)
    configure_web_server_logger()

    analyticReporterWebServer.logger.info("Start " + analyticReporterWebServerName)
    analyticReporterWebServer.logger.info("Get " + analyticReporterWebServerName + " configuration " + analyticReporterWebServerConfiguration)
    analyticReporterWebServer.logger.info("Run " + analyticReporterWebServerName + " on " + analyticReporterWebServerIP + ":" + str(analyticReporterWebServerPort))

    if analyticReporterWebServerInDebugMode:
        analyticReporterWebServer.logger.info("Run in debug mode")

    analyticReporterWebServer.run(host=analyticReporterWebServerIP,
                                  port=analyticReporterWebServerPort,
                                  debug=analyticReporterWebServerInDebugMode,
                                  ssl_context="adhoc")

if __name__ == "__main__":
    main()

