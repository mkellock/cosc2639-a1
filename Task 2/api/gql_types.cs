using System;
using System.Collections;
using Google.Cloud.BigQuery.V2;

namespace api
{
    public class HighestTradeValue
    {
        public long Time { get; set; }

        public double TradeValue { get; set; }
    }

    public class HighestTotalTradeDeficit
    {
        public string CountryLabel { get; set; }
        public string ProductType { get; set; }
        public double TradeDeficitValue { get; set; }
        public string Status { get; set; }
    }

    public class HighestTotalTradeSurplus
    {
        public string ServiceLabel { get; set; }
        public double TradeSurplusValue { get; set; }
    }

    public class Query
    {
        public List<HighestTradeValue> GetHighestTradeValue()
        {
            var client = BigQueryClient.Create("cosc2639-assignment-1-task-2");
            List<HighestTradeValue> getHighestTradeValue = new();

            var sql = "SELECT      time_ref, SUM(value) AS trade_value \n" +
                      "FROM        `cosc2639-assignment-1-task-2.task_2_dataset.data` \n" +
                      "GROUP BY    time_ref \n" +
                      "ORDER BY    trade_value DESC \n" +
                      "LIMIT 10";
            var results = client.ExecuteQuery(sql, parameters: null);

            foreach (var row in results)
            {
                getHighestTradeValue.Add(new HighestTradeValue()
                {
                    Time = (long)row["time_ref"],
                    TradeValue = (double)row["trade_value"]
                });
            }

            return getHighestTradeValue;
        }
        public List<HighestTotalTradeDeficit> GetHighestTotalTradeDeficit()
        {
            var client = BigQueryClient.Create("cosc2639-assignment-1-task-2");
            List<HighestTotalTradeDeficit> getHighestTotalTradeDeficit = new();

            var sql = "SELECT      C.country_label, D.product_type, D.status,\n" +
                      "SUM(CASE WHEN D.account = 'Exports' THEN D.value ELSE D.value * -1 END) AS trade_deficit_value\n" +
                      "FROM        `cosc2639-assignment-1-task-2.task_2_dataset.data` D\n" +
                      "INNER JOIN  `cosc2639-assignment-1-task-2.task_2_dataset.country_classification` C ON D.country_code = C.country_code\n" +
                      "WHERE       D.status = 'F'\n" +
                      "            AND D.time_ref >= 201400 AND D.time_ref < 201700\n" +
                      "            AND D.country_code != 'TOT'\n" +
                      "            AND D.product_type = 'Goods'\n" +
                      "GROUP BY    D.country_code, C.country_label, D.product_type, D.status\n" +
                      "ORDER BY    trade_deficit_value DESC\n" +
                      "LIMIT 50";
            var results = client.ExecuteQuery(sql, parameters: null);

            foreach (var row in results)
            {
                getHighestTotalTradeDeficit.Add(new HighestTotalTradeDeficit()
                {
                    CountryLabel = (string)row["country_label"],
                    ProductType = (string)row["product_type"],
                    TradeDeficitValue = (double)row["trade_deficit_value"],
                    Status = (string)row["status"]
                });
            }

            return getHighestTotalTradeDeficit;
        }

        public List<HighestTotalTradeSurplus> GetHighestTotalTradeSurplus()
        {
            var client = BigQueryClient.Create("cosc2639-assignment-1-task-2");
            List<HighestTotalTradeSurplus> getHighestTotalTradeSurplus = new();

            var sql = "SELECT      S.service_label,\n" +
                      "            SUM(CASE WHEN D.account = 'Imports' THEN D.value ELSE D.value * -1 END) AS trade_surplus_value\n" +
                      "FROM        `cosc2639-assignment-1-task-2.task_2_dataset.services_classification` S\n" +
                      "INNER JOIN  `cosc2639-assignment-1-task-2.task_2_dataset.data` D ON D.code = S.code\n" +
                      "WHERE       D.product_type = 'Services'\n" +
                      "GROUP BY    S.code, S.service_label\n" +
                      "ORDER BY    trade_surplus_value DESC\n" +
                      "LIMIT 30";
            var results = client.ExecuteQuery(sql, parameters: null);

            foreach (var row in results)
            {
                getHighestTotalTradeSurplus.Add(new HighestTotalTradeSurplus()
                {
                    ServiceLabel = (string)row["service_label"],
                    TradeSurplusValue = (double)row["trade_surplus_value"]
                });
            }

            return getHighestTotalTradeSurplus;
        }
    }
}