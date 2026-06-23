/**
	@file TcMongoDriver.h
	@author Giuseppe Pedone
	@version 2.0 04/05/2021
*/

/*# +---------------------------------------------------------+
# |   -=*=-  THIS FILE IS NOT INTENDED FOR SHARING  -=*=-   |
# +---------------------------------------------------------+
# The intellectual and technical concepts are proprietary.
# Dissemination or reproduction is forbidden and may result
# in civil charges and criminal penalties.
*/

#ifndef TCMONGODRIVER_H
#define TCMONGODRIVER_H


#define MONGO_DEFAULT_PORT 27017
#define MONGO_DEFAULT_HOST "localhost"
#define MONGO_DEFAULT_CONNTYPE "mongodb"
#define MONGO_DRIVER_NAME "SpeaMongoDriver"

#include <mongocxx/instance.hpp>
#include <mongocxx/pool.hpp>
#include <mongocxx/exception/exception.hpp>
#include <mongocxx/exception/bulk_write_exception.hpp>
#include <mongocxx/pipeline.hpp>
#include <bsoncxx/document/value.hpp>
#include <bsoncxx/exception/exception.hpp>	
#include <bsoncxx/document/view_or_value.hpp>
#include <bsoncxx/builder/stream/array.hpp>
#include <bsoncxx/builder/stream/document.hpp>
#include <mongocxx/client.hpp>
#include <mongocxx/database.hpp>
#include <mongocxx/cursor.hpp>
#include <mongocxx/collection.hpp>
#include <mongocxx/exception/operation_exception.hpp>
#include <mongocxx/exception/query_exception.hpp>
#include <bsoncxx/builder/stream/document.hpp>
#include <bsoncxx/exception/exception.hpp>
#include <bsoncxx/json.hpp>
#include <mongocxx/result/insert_one.hpp>
#include <mongocxx/exception/bulk_write_exception.hpp>
#include <inttypes.h>
#include <string>
#include <list>
#include "./TcColors.h"


#pragma region Internal Error Codes
constexpr int8_t kErr_DatabaseExist_Create = -2;
constexpr int8_t kErr_DatabaseExist = -1;
constexpr int8_t kDatabaseExist_Create_Ok = 0;
constexpr int8_t kErr_CollectionExist_Create = -2;
constexpr int8_t kCollectionExist_Create_Ok = 1;
constexpr int8_t kErr_CollectionExist = -1;
constexpr int8_t kCollectionExist_Ok = 0;
#pragma endregion

#pragma region External Error Codes
constexpr int8_t kErr_Connect_MemAlloc = -1;
constexpr int8_t kErr_Connect_Operation = -2;
constexpr int8_t kConnect_Ok = 0;
constexpr int8_t kErr_Insert_ClientAcquire = -1;
constexpr int8_t kErr_Insert_DatabaseExist = -2;
constexpr int8_t kErr_Insert_CollectionExist = -3;
constexpr int8_t kErr_Insert = -4;
constexpr int8_t kInsert_Ok = 0;
#pragma endregion

#pragma region Generic Server Error
constexpr uint16_t SERVER_CONNECTION_ERROR = 13053;
#pragma endregion



using namespace std;


class TcMongoDriver
{
	private:

		#pragma region Internal class Attributes
			inline static mongocxx::instance cmMongoDriverInstance = mongocxx::instance();
		#pragma endregion
		#pragma region Internal Attributes
				string rmMongoDriverName;
				string rmMongoDriverRemoteConnectionType;
				string rmMongoDriverRemoteConnectionHost;
				uint16_t rmMongoDriverRemoteConnectionPort;
		#pragma endregion

	public:
		class TcMongoError{
				public:
					class TcMongoConnection {
						public:
							static const int kNotConnected = -1;
					};
					class TcMongoUri {
						public:
							static const int kNotConnected = -1;
					};
					class TcMongoCursor {
						public:
							static const int kNotConnected = -1;
					};

					class TcMongoQuery {
						public:
							static const int kSuccess = 0;
							static const int kQueryFail = -1;
					};
					class TcMongoInsert {
						public:
							static const int kSuccess = 0;
							static const int kInsertionFails = -1;
					};
					class TcMongoClient {
						public:
							static const int kInvalidClient = -1;
					};
					class TcMongoDatabase {
						public:
							static const int kCreated = 1;
							static const int kExist = 0;
							static const int kDoNotExist = -1;
							static const int kIsEmpty = -2;
							static const int kUnableToCreate = -3;
							static const int kInvalidDatabase = -4;

					};
					class TcMongoCollection {
						public:
							static const int kCreated = 1;
							static const int kExist = 0;
							static const int kDoNotExist = -1;
							static const int kIsEmpty = -2;
							static const int kUnableToCreate = -3;
							static const int kInvalidCollection = -4;

					};
			};
		#pragma region External Functions

				TcMongoDriver(string pMongoDriverName, string pMongoDriverRemoteConnectionType, string pMongoDriverRemoteConnectionHost, uint16_t pMongoDriverRemoteConnectionPort);
				TcMongoDriver();
				~TcMongoDriver();


				string fGetMongoDriverConnectionHost();
				string fGetMongoDriverConnectionType();
				uint16_t fGetMongoDriverConnectionPort();

				/**
				* Verify if a the given Database exists. If it does not exists, it will be created.
				*
				* @param[in] pDatabase the string object that represents the Databasename to verify.
				* @param[in] pMongoClient the mongocxx::client object that has been acquired.
				* @returns Integer Error Code:
				*      - kDATABASEEXIST_CREATE_FAILS if the Database does not exists and its creation fails.
				*      - kDATABASEEXIST_CREATE_SUCCESS if the Database does not exists and its creation success.
				*      - kDATABASEEXIST_FAILS if an exception has been thrown.
				*      - kDATABASEEXIST_SUCCESS if the Database exists.
				*/
				int fDatabaseExist(string pDatabase, mongocxx::client& pMongoClient, bool pCreate = true);


				/**
				* Verify if a the given Database exists. If it does not exists, it will be created.
				*
				* @param[in] pCollection the string object that represents the Databasename to verify.
				* @param[in] pMongoDatabase the mongocxx::database object that has been acquired.
				* @returns Integer Error Code:
				*      - kCOLLECTIONEXIST_CREATE_FAILS if the Collection does not exists and its creation fails.
				*      - kCOLLECTIONEXIST_CREATE_SUCCESS if the Collection does not exists and its creation success.
				*      - kCOLLECTIONEXIST_FAILS if a mongo exception has been thrown.
				*      - kCOLLECTIONEXIST_SUCCESS if the Collection exists.
				*/
				int fCollectionExist(string pCollection, mongocxx::database pMongoDatabase, bool pCreate = true);


				/**
				* Insert a Document into a Mongo Collection that is contained in a Mongo Database.
				*
				*/
				int fInserDocument(string pDatabase, string pCollection, string pDocument);
				int fInserDocument(string pDatabase, string pCollection, bsoncxx::document::view_or_value pBsonDocument);

				/**
				* Insert a Document List into a Mongo Collection that is contained in a Mongo Database.
				*
				*/
				int fInsertDocumentList(string pDatabase, string pCollection, list<string> pDocuments);
				int fInsertDocumentList(string pDatabase, string pCollection, list<bsoncxx::document::view_or_value> pBsonDocuments);

				int fRunQuery(list<string>* pOutputList, string pDatabase, string pCollection, string pFilter = "", string pProjection = "", string pSortcriteria = "", int pSkip = 0, int pLimit = 0, string pGroupcriteria = "", string pAddfieldscriteria = "");
				int fRunQuery(list<string>* pOutputList, string pDatabase, string pCollection, bsoncxx::document::view_or_value pFilter = bsoncxx::document::view_or_value(), bsoncxx::document::view_or_value pProjection = bsoncxx::document::view_or_value(), bsoncxx::document::view_or_value pSortcriteria = bsoncxx::document::view_or_value(), int pSkip = 0, int pLimit = 0, bsoncxx::document::view_or_value pGroupcriteria = bsoncxx::document::view_or_value());
		#pragma endregion
		
		#pragma region External Generic Functions
				template<class T>
				int fInsertDocument(string pDatabase, string pCollection, T pDocument);

				template<class T>
				int fInsertDocumentList(string pDatabase, string pCollection, list<T> pDocuments);

				template<class T>
				int fRunQuery(list<T>* pOutputList, string pDatabase, string pCollection, string pFilter, string pProjection, string pSortcriteria, int pSkip = 0, int pLimit = 0, string pGroupcriteria = "", string pAddfieldscriteria = "");
		#pragma endregion

};






template<class T>
int TcMongoDriver::fInsertDocument(string pDatabase, string pCollection, T pDocument) {
	
	mongocxx::database cMongoDatabase;
	mongocxx::collection cMongoCollection;
	bsoncxx::document::view_or_value cBsonDocument;
	int rResult = 0;

	string cMongoDriverRemoteConnectionString = this->rmMongoDriverRemoteConnectionType + "://" + this->rmMongoDriverRemoteConnectionHost + ":" + to_string(this->rmMongoDriverRemoteConnectionPort);
	const mongocxx::uri& cMongoDriverConnectionUri{ bsoncxx::string::view_or_value(cMongoDriverRemoteConnectionString) };

	mongocxx::client cMongoClient = mongocxx::client(cMongoDriverConnectionUri);
	if (!cMongoClient) {
		fprintf(stdout, ANSI_COLOR_RED "(%s) Mongo client invalid" ANSI_COLOR_RESET "\n", __func__);
		fflush(stdout);
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
		return(TcMongoError::TcMongoClient::kInvalidClient);
	}


	if ((rResult = fDatabaseExist(pDatabase, cMongoClient)) < 0) {
		fprintf(stdout, ANSI_COLOR_RED "(%s) Database exist fails with error %d" ANSI_COLOR_RESET "\n", __func__, rResult);
		fflush(stdout);
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
		return(rResult);
	}

	cMongoDatabase = cMongoClient[pDatabase];
	if (!cMongoDatabase) {
		fprintf(stdout, ANSI_COLOR_RED "(%s) Mongo database invalid" ANSI_COLOR_RESET "\n", __func__);
		fflush(stdout);
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
		return(TcMongoError::TcMongoDatabase::kInvalidDatabase);
	}


	if ((rResult = fCollectionExist(pCollection, cMongoDatabase)) < 0) {
		fprintf(stdout, ANSI_COLOR_RED "(%s) Collection exist fails with error %d" ANSI_COLOR_RESET "\n", __func__, rResult);
		fflush(stdout);
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
		return(rResult);
	}
	
	cMongoCollection = cMongoDatabase[pCollection];
	if (!cMongoCollection) {
		fprintf(stdout, ANSI_COLOR_RED "(%s) Mongo collection invalid" ANSI_COLOR_RESET "\n", __func__);
		fflush(stdout);
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
		return(TcMongoError::TcMongoCollection::kInvalidCollection);
	}


	try {
		cBsonDocument = T::fSerializeObjectBsonValue(pDocument);
	}
	catch (mongocxx::query_exception qe) {
		fprintf(stdout, "Catched exception - Message %s Value %d Category %s\n", qe.code().message().c_str(), qe.code().value(), qe.code().category().name());
		fflush(stdout);
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
		throw qe;
	}

	try {
		auto cResult = cMongoCollection.insert_one(cBsonDocument);
		if (!cResult) {
			fprintf(stdout, "(%s) Insertion fails\n", __func__);
			fflush(stdout);
			fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
			fflush(stdout);
			return(TcMongoError::TcMongoInsert::kInsertionFails);
		} else {
			fprintf(stdout, "(%s) Insertion success\n", __func__, __func__);
			fflush(stdout);
			fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
			fflush(stdout);
			return(TcMongoError::TcMongoInsert::kSuccess);
		}
	}
	catch (mongocxx::bulk_write_exception e) {
		printf("Catched exception - Message %s Value %d Category %s\n", e.code().message().c_str(), e.code().value(), e.code().category().name());
		fflush(stdout);
		return(kErr_Insert);
	}
	catch (mongocxx::exception e) {
		fprintf(stdout, "Catched exception - Message %s Value %d Category %s\n", e.code().message().c_str(), e.code().value(), e.code().category().name());
		fflush(stdout);
		return(kErr_Insert);
	}
}

template<class T>
int TcMongoDriver::fInsertDocumentList(string pDatabase, string pCollection, list<T> pDocuments) {
	
	mongocxx::database cMongoDatabase;
	mongocxx::collection cMongoCollection;
	bsoncxx::document::view_or_value cBsonDocument;
	list<bsoncxx::document::view_or_value> cBsonDocuments;
	int rResult = 0;

	string cMongoDriverRemoteConnectionString = this->rmMongoDriverRemoteConnectionType + "://" + this->rmMongoDriverRemoteConnectionHost + ":" + to_string(this->rmMongoDriverRemoteConnectionPort);
	const mongocxx::uri& cMongoDriverConnectionUri{ bsoncxx::string::view_or_value(cMongoDriverRemoteConnectionString) };

	mongocxx::client cMongoClient = mongocxx::client(cMongoDriverConnectionUri);
	if (!cMongoClient) {
		fprintf(stdout, ANSI_COLOR_RED "(%s) Mongo client invalid" ANSI_COLOR_RESET "\n", __func__);
		fflush(stdout);
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
		return(TcMongoError::TcMongoClient::kInvalidClient);
	}


	if ((rResult = fDatabaseExist(pDatabase, cMongoClient)) < 0) {
		fprintf(stdout, ANSI_COLOR_RED "(%s) Database exist fails with error %d" ANSI_COLOR_RESET "\n", __func__, rResult);
		fflush(stdout);
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
		return(rResult);
	}

	cMongoDatabase = cMongoClient[pDatabase];
	if (!cMongoDatabase) {
		fprintf(stdout, ANSI_COLOR_RED "(%s) Mongo database invalid" ANSI_COLOR_RESET "\n", __func__);
		fflush(stdout);
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
		return(TcMongoError::TcMongoDatabase::kInvalidDatabase);
	}


	if ((rResult = fCollectionExist(pCollection, cMongoDatabase)) < 0) {
		fprintf(stdout, ANSI_COLOR_RED "(%s) Collection exist fails with error %d" ANSI_COLOR_RESET "\n", __func__, rResult);
		fflush(stdout);
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
		return(rResult);
	}
	
	cMongoCollection = cMongoDatabase[pCollection];
	if (!cMongoCollection) {
		fprintf(stdout, ANSI_COLOR_RED "(%s) Mongo collection invalid" ANSI_COLOR_RESET "\n", __func__);
		fflush(stdout);
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
		return(TcMongoError::TcMongoCollection::kInvalidCollection);
	}


	for (T cDocument : pDocuments) {
		try {
			cBsonDocument = T::fSerializeObjectBsonValue(cDocument);
			cBsonDocuments.push_back(cBsonDocument);
		}
		catch (mongocxx::query_exception e) {
			fprintf(stdout, "Catched exception - Message %s Value %d Category %s\n", e.code().message().c_str(), e.code().value(), e.code().category().name());
			fflush(stdout);
			fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
			fflush(stdout);
		}
	}

	try {
		auto cResult = cMongoCollection.insert_many(cBsonDocuments);
		if (!cResult) {
			fprintf(stdout, "(%s) Insertion fails\n", __func__);
			fflush(stdout);
			fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
			fflush(stdout);
			return(TcMongoError::TcMongoInsert::kInsertionFails);
		} else {
			fprintf(stdout, "(%s) Insertion success\n", __func__, __func__);
			fflush(stdout);
			fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
			fflush(stdout);
			return(TcMongoError::TcMongoInsert::kSuccess);
		}
	}
	catch (mongocxx::bulk_write_exception e) {
		printf("Catched exception - Message %s Value %d Category %s\n", e.code().message().c_str(), e.code().value(), e.code().category().name());
		fflush(stdout);
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
		return(kErr_Insert);
	}
	catch (mongocxx::exception e) {
		fprintf(stdout, "Catched exception - Message %s Value %d Category %s\n", e.code().message().c_str(), e.code().value(), e.code().category().name());
		fflush(stdout);
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
		return(kErr_Insert);
	}
}

template<class T>
int TcMongoDriver::fRunQuery(list<T>* pOutputList, string pDatabase, string pCollection, string pFilter, string pProjection, string pSortcriteria, int pSkip, int pLimit, string pGroupcriteria, string pAddfieldscriteria) {
	mongocxx::database cMongoDatabase;
	mongocxx::collection cMongoCollection;
	bsoncxx::document::view_or_value cQueryFilter;
	bsoncxx::document::view_or_value cQueryProjection;
	bsoncxx::document::view_or_value cQuerySortcriteria;
	bsoncxx::document::view_or_value cQueryGroupcriteria;
	bsoncxx::document::view_or_value cQueryAddFields;
	mongocxx::pipeline cQueryPipeline;
	list<T> cOutputList;
	int rResult = 0;

	string cMongoDriverRemoteConnectionString = this->rmMongoDriverRemoteConnectionType + "://" + this->rmMongoDriverRemoteConnectionHost + ":" + to_string(this->rmMongoDriverRemoteConnectionPort);
	const mongocxx::uri& cMongoDriverConnectionUri{ bsoncxx::string::view_or_value(cMongoDriverRemoteConnectionString) };

	mongocxx::client cMongoClient = mongocxx::client(cMongoDriverConnectionUri);
	if (!cMongoClient) {
		fprintf(stdout, ANSI_COLOR_RED "(%s) Mongo client invalid" ANSI_COLOR_RESET "\n", __func__);
		fflush(stdout);
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
		return(TcMongoError::TcMongoClient::kInvalidClient);
	}


	if ((rResult = fDatabaseExist(pDatabase, cMongoClient)) < 0) {
		fprintf(stdout, ANSI_COLOR_RED "(%s) Database exist fails with error %d" ANSI_COLOR_RESET "\n", __func__, rResult);
		fflush(stdout);
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
		return(rResult);
	}

	cMongoDatabase = cMongoClient[pDatabase];
	if (!cMongoDatabase) {
		fprintf(stdout, ANSI_COLOR_RED "(%s) Mongo database invalid" ANSI_COLOR_RESET "\n", __func__);
		fflush(stdout);
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
		return(TcMongoError::TcMongoDatabase::kInvalidDatabase);
	}


	if ((rResult = fCollectionExist(pCollection, cMongoDatabase)) < 0) {
		fprintf(stdout, ANSI_COLOR_RED "(%s) Collection exist fails with error %d" ANSI_COLOR_RESET "\n", __func__, rResult);
		fflush(stdout);
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
		return(rResult);
	}
	
	cMongoCollection = cMongoDatabase[pCollection];
	if (!cMongoCollection) {
		fprintf(stdout, ANSI_COLOR_RED "(%s) Mongo collection invalid" ANSI_COLOR_RESET "\n", __func__);
		fflush(stdout);
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
		return(TcMongoError::TcMongoCollection::kInvalidCollection);
	}

	if (pFilter != "") {
		cQueryFilter = bsoncxx::from_json(pFilter);
		cQueryPipeline.match(cQueryFilter);
	}
	if (pSortcriteria != "") {
		cQuerySortcriteria = bsoncxx::from_json(pSortcriteria);
		cQueryPipeline.sort(cQuerySortcriteria);
	}
	if (pLimit != 0) {
		cQueryPipeline.limit(pLimit);
	}
	if (pSkip != 0) {
		cQueryPipeline.skip(pSkip);
	}
	if (pGroupcriteria != "") {
		cQueryGroupcriteria = bsoncxx::from_json(pGroupcriteria);
		cQueryPipeline.group(cQueryGroupcriteria);
	}
	if (pProjection != "") {
		cQueryProjection = bsoncxx::from_json(pProjection);
		cQueryPipeline.project(cQueryProjection);
	}
	if (pAddfieldscriteria != "") {
		cQueryAddFields = bsoncxx::from_json(pAddfieldscriteria);
		cQueryPipeline.add_fields(cQueryAddFields);
	}

	try {

		mongocxx::options::aggregate cAggregateOptions;
		cAggregateOptions.allow_disk_use(true);
		mongocxx::cursor cMongoCursor = cMongoCollection.aggregate(cQueryPipeline, cAggregateOptions);

		for (bsoncxx::document::view cBsonDocument : cMongoCursor) {
			try {
				T cDocument(cBsonDocument);

				cOutputList.push_back(cDocument);
			}
			catch (bsoncxx::exception be) {
				fprintf(stdout, "Catched exception - Message %s Value %d Category %s\n", be.code().message().c_str(), be.code().value(), be.code().category().name());
				fflush(stdout);
				fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
				fflush(stdout);
				throw be;
			}
		}

		*pOutputList = cOutputList;
		return(TcMongoError::TcMongoQuery::kSuccess);
	}
	catch (mongocxx::query_exception qe) {
		fprintf(stdout, "Catched exception - Message %s Value %d Category %s\n", qe.code().message().c_str(), qe.code().value(), qe.code().category().name());
		fflush(stdout);
		fprintf(stdout, "(%s) Exit from %s \n", __func__, __func__);
		fflush(stdout);
		throw qe;
	}
}

#endif //TCMONGODRIVER_H



